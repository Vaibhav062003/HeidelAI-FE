import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Contact {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  bio?: string;
  company?: string;
  tags: string[];
  platform?: string;
  user_name?: string;
  created_at?: string;
  updated_at?: string;
}

interface ContactFormModalProps {
  contact?: Partial<Contact>;
  onClose: () => void;
  onSave: (contact: Partial<Contact>) => void;
}

export const ContactForm = ({
  contact,
  onClose,
  onSave,
}: ContactFormModalProps) => {
  const [formData, setFormData] = useState<Partial<Contact>>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    bio: "",
    company: "",
    platform: "",
    ...contact,
    tags: Array.isArray(contact?.tags) ? contact.tags : [], // Type guard
  });

  const [tagsList, setTagsList] = useState<string[]>([]);
  const [loadingTags, setLoadingTags] = useState(true);
  const [isTagsOpen, setIsTagsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch tag names from Supabase
  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase
        .from("tags")
        .select("name")
        .order("name", { ascending: true });

      if (!error && data) {
        setTagsList(
          data.map((tag: { name: string }) => tag.name).filter((name): name is string => !!name)
        );
      }
      setLoadingTags(false);
    };
    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Phone number validation
    if (formData.phone) {
      console.log("Starting phone validation for:", formData.phone);

      // Check phone number length
      if (formData.phone.length !== 10) {
        alert("Phone number must be exactly 10 digits");
        return;
      }

      // Simplified query to check for duplicate phone numbers
      const { data: existingContacts, error: phoneCheckError } = await supabase
        .from("contacts")
        .select("id, phone")
        .eq("phone", formData.phone);

      if (phoneCheckError) {
        console.error("Phone check error details:", phoneCheckError);
        alert("Error checking phone number uniqueness");
        return;
      }

      // Check if phone exists in another contact
      if (existingContacts && existingContacts.length > 0) {
        const isDuplicate = existingContacts.some(
          (existingContact) => existingContact.id !== contact?.id
        );

        if (isDuplicate) {
          alert(`Phone number ${formData.phone} is already in use`);
          return;
        }
      }
    }

    // required fields
    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("First Name, Last Name, and Email are required fields");
      return;
    }

    // Validate tags exist in tags table first
    const { data: existingTags } = await supabase
      .from("tags")
      .select("name")
      .in("name", formData.tags || []);

    const invalidTags = (formData.tags || []).filter(
      (t) => !existingTags?.some((et: { name: string }) => et.name === t)
    );

    if (invalidTags.length > 0) {
      alert(`Invalid tags: ${invalidTags.join(", ")}`);
      return;
    }

    try {
      const contactData = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      let response;
      if (contact?.id) {
        response = await supabase
          .from("contacts")
          .update(contactData)
          .eq("id", contact.id);
      } else {
        response = await supabase.from("contacts").insert([
          {
            ...contactData,
            created_at: new Date().toISOString(),
          },
        ]);
      }

      if (response.error) throw response.error;

      // Now handle broadcast tables
      if (contactData.platform === "Whatsapp" && contactData.phone) {
        // Save to WhatsApp broadcast table
        for (const tag of contactData.tags || []) {
          const { error: whatsappError } = await supabase
            .from("broadcast_whatsapp")
            .insert([
              {
                tag_name: tag,
                phone: contactData.phone,
              },
            ]);

          if (whatsappError) throw whatsappError;
        }
      } else if (
        contactData.platform === "Instagram" &&
        contactData.user_name
      ) {
        // Save to Instagram broadcast table
        for (const tag of contactData.tags || []) {
          const { error: instagramError } = await supabase
            .from("broadcast_instagram")
            .insert([
              {
                user_name: contactData.user_name,
                tag_name: tag,
              },
            ]);

          if (instagramError) throw instagramError;
        }
      }

      onSave(contactData);
    } catch (error: any) {
      alert(`Error saving contact: ${error.message}`);
    }
  };

  // dropdown tag list
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsTagsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTag = (tagName: string) => {
    const currentTags = Array.isArray(formData.tags) ? formData.tags : [];
    const newTags = currentTags.includes(tagName)
      ? currentTags.filter((name) => name !== tagName)
      : [...currentTags, tagName];

    setFormData({ ...formData, tags: newTags });
  };

  const countries = [
    "India",
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
  ];

  const platforms = ["Whatsapp", "Instagram"];
  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 p-6">
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium mb-1">First Name *</label>
        <input
          required
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.firstName || ""}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Last Name *</label>
        <input
          required
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.lastName || ""}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email *</label>
        <input
          required
          type="email"
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          type="tel"
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.phone || ""}
          onChange={(e) => {
            // Allow only numbers
            const value = e.target.value.replace(/\D/g, "");
            setFormData({ ...formData, phone: value });
          }}
          maxLength={10}
          pattern="\d{10}"
          title="Please enter exactly 10 digits"
        />
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium mb-1">City</label>
        <input
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.city || ""}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        />
      </div>

      {/* Country */}
      <div>
        <label className="block text-sm font-medium mb-1">Country</label>
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.country || ""}
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {/* Platform */}
      <div>
        <label className="block text-sm font-medium mb-1">Platform</label>
        <select
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.platform || ""}
          onChange={(e) =>
            setFormData({ ...formData, platform: e.target.value })
          }
        >
          <option value="">Select Platform</option>
          {platforms.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </select>
      </div>

      {/* Instagram ID */}
      <div className={formData.platform === "Instagram" ? "block" : "hidden"}>
        <label className="block text-sm font-medium mb-1">Instagram ID *</label>
        <input
          required={formData.platform === "Instagram"}
          className="w-full px-3 py-2 border rounded-lg"
          value={formData.user_name || ""}
          onChange={(e) =>
            setFormData({ ...formData, user_name: e.target.value })
          }
        />
      </div>

      {/* Bio */}
      <div className="col-span-2">
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          className="w-full px-3 py-2 border rounded-lg h-24"
          value={formData.bio || ""}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        />
      </div>

      {/* Tags Dropdown */}
      <div className="col-span-2 relative" ref={dropdownRef}>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <div className="relative">
          <div
            className="w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between bg-white"
            onClick={() => setIsTagsOpen(!isTagsOpen)}
          >
            <div className="flex flex-wrap gap-1 flex-1 mr-2">
              {Array.isArray(formData.tags) &&
                formData.tags.map((tagName) => (
                  <span
                    key={tagName}
                    className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded mb-1"
                  >
                    {tagName}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTag(tagName);
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
            </div>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isTagsOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>

          {isTagsOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
              {tagsList.map((tagName) => (
                <div
                  key={tagName}
                  onClick={() => toggleTag(tagName)}
                  className={`px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center ${
                    formData.tags?.includes(tagName) ? "bg-blue-50" : ""
                  }`}
                >
                  <span
                    className={`mr-2 ${
                      formData.tags?.includes(tagName) ? "text-blue-600" : ""
                    }`}
                  >
                    {formData.tags?.includes(tagName) ? "✓" : ""}
                  </span>
                  {tagName}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="col-span-2 flex justify-end space-x-3 mt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Save Contact
        </button>
      </div>
    </form>
  );
};
