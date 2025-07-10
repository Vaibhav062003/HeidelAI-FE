import requests
import json
import re
import google.generativeai as genai  # Import Gemini SDK

# Define constants
API_VERSION = "v21.0"
IG_USER_ID = "17841438674306985"  # Replace with your Instagram Business/Creator Account ID
ACCESS_TOKEN = "EAAHPjYclZCTEBO9k47ZCwZCDdPAtLutdwULVtKTg6Lu5RuRtRO8mLyDmZAganPIqG0LoLNIyyDv3lATPXaoEUeQZA6R1ooynFKn1b3lsyVehC26IjSddZCXTykUU663uokVQEjmZAyAmARKvxKD0lbkYWDZBjwvhZB0HwZAEw4nZBbxrxl5OyZBb8Qch30Qj4I5ZCqyi48SqP6uXejd3tCfSs"  # Replace with your valid Access Token
GEMINI_API_KEY =  "AIzaSyBVY2HB4BHkrPw8Vo0i_9AbwImaKo8vgWM" # Replace with your Gemini API key

# Configure Gemini API
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash-preview-05-20')  # Use 'gemini-pro-vision' if analyzing images

# Function to fetch all data for a single username

def fetch_all_user_data(username, max_media_count):
    url = f"https://graph.facebook.com/{API_VERSION}/{IG_USER_ID}"
    
    # Add 'like_count', 'comments_count', and other engagement fields to the query
    params = {
        "access_token": ACCESS_TOKEN,
        "fields": f"business_discovery.username({username}){{username,name,biography,followers_count,follows_count,media_count,media{{caption,id,media_type,media_url,permalink,timestamp,like_count,comments_count}}}}"
    }
    
    response = requests.get(url, params=params)
    if response.status_code == 200:
        data = response.json()
        all_media = []
        
        if 'media' in data['business_discovery']:
            media_items = data['business_discovery']['media']['data']
            all_media.extend(media_items[:max_media_count])  # Limit the number of media items
            
            # Handle pagination if more media is needed
            while len(all_media) < max_media_count and 'paging' in data['business_discovery']['media'] and 'next' in data['business_discovery']['media']['paging']:
                next_url = data['business_discovery']['media']['paging']['next']
                response = requests.get(next_url)
                if response.status_code == 200:
                    data = response.json()
                    additional_media = data['media']['data']
                    remaining_count = max_media_count - len(all_media)
                    all_media.extend(additional_media[:remaining_count])
                else:
                    print(f"Error fetching next page for {username}: {response.status_code}")
                    break
        
        # Add hashtags and other metadata to each media item
        for media_item in all_media:
            if 'caption' in media_item and media_item['caption']:
                # Extract hashtags using regex
                hashtags = re.findall(r'#\w+', media_item['caption'])
                media_item['hashtags'] = hashtags
            else:
                media_item['hashtags'] = []
            
            # Ensure like_count and comments_count are present (default to 0 if missing)
            media_item['like_count'] = media_item.get('like_count', 0)
            media_item['comments_count'] = media_item.get('comments_count', 0)
        
        # Update the media field with the limited media
        data['business_discovery']['media']['data'] = all_media
        
        return data
    else:
        print(f"Error fetching data for {username}: {response.status_code}")
        print(response.json())
        return None

# Function to analyze data using Gemini
def analyze_with_gemini(data):
    # Prepare the input for Gemini
    profile_info = data['business_discovery']
    username = profile_info['username']
    biography = profile_info.get('biography', '')
    followers_count = profile_info.get('followers_count', 0)
    follows_count = profile_info.get('follows_count', 0)
    media_count = profile_info.get('media_count', 0)
    media_items = profile_info['media']['data']
    
    # Build a summary of the account
    media_summary = "\n".join([
        f"- Media ID: {item.get('id', 'N/A')}, "
        f"Caption: {item.get('caption', 'No caption')}, "
        f"Hashtags: {', '.join(item.get('hashtags', [])) or 'No hashtags'}, "
        f"Likes: {item.get('like_count', 0):,}, "
        f"Comments: {item.get('comments_count', 0):,}"
        
        for item in media_items
    ])
    
    # Extract all hashtags from media items
    all_hashtags = []
    total_likes = 0
    total_comments = 0
    for item in media_items:
        all_hashtags.extend(item.get('hashtags', []))
        total_likes += item.get('like_count', 0)
        total_comments += item.get('comments_count', 0)
    
    hashtags_summary = ", ".join(set(all_hashtags)) or "No hashtags"
    
    prompt = f"""
    Conduct an exhaustive political campaign analysis for optimization and electoral victory. Use the following data:
    Account Metrics:
    - Handle: {username}
    - Bio: {biography}
    - Follower Base: {followers_count:,}
    - Following Count: {follows_count:,}
    - Content Volume: {media_count:,}
    - Total Likes Across Posts: {total_likes:,}
    - Total Comments Across Posts: {total_comments:,}
    Recent Content Analysis:
    {media_summary}
    Hashtags Used: {hashtags_summary}

    You are an uncompromising political strategist and data scientist tasked with evaluating the digital performance of our political campaign. 
Your objective is to provide an in-depth, no-holds-barred analysis of the data extracted from multiple Meta API accounts, and to drive radical improvements for election performance. You must focus solely on tangible results, and spare no detail in your critique. Your analysis should be brutally honest, data-driven, and relentlessly focused on measurable outcomes.

Data Provided:
- Account Information: username, biography, follower count, following count, media count.
- Media Details: For each post, details include caption, media type, media URL, permalink, timestamp, and extracted hashtags.
- Engagement Metrics: Real-time likes, comments, shares, and other interactions (if available).
- Historical Trends: Posting frequency, content evolution, and engagement trends over time.

Your analysis must address the following in extreme depth:

1. Comprehensive Data Overview:
   - Present a clear snapshot of the account’s performance. Break down follower growth versus engagement rates.
   - Identify anomalies, inconsistencies, or any red flags in the provided data. 
   - Examine the account biography and posting patterns; flag any elements that appear outdated or counterproductive.

2. Brutal Social Media Engagement Analysis:
   - Analyze every post's performance in granular detail. Calculate engagement ratios and trends, and compare these to campaign benchmarks.
   - Identify underperforming posts with ruthless precision. For each post, quantify the deficit in likes, shares, and comments.
   - Critically assess the timing, format, and messaging of posts. If any content is subpar, explicitly name its failings—whether due to poor timing, weak content, or irrelevant hashtags.
   - Provide a rigorous comparison of engagement over time. Pinpoint any downward trends and their potential impact on voter mobilization.

3. Raw Sentiment and Content Critique:
   - Conduct a comprehensive sentiment analysis on captions, hashtags, and available comments. Expose any negative sentiment or divisive rhetoric that could jeopardize voter support.
   - Scrutinize recurring themes and narratives. If current messaging lacks potency or is misaligned with voter interests, deliver a harsh critique and detailed reasoning.
   - Do not sugarcoat: if the content strategy is mediocre or harmful, identify it explicitly and demand immediate corrective action.

4. Deep Audience Segmentation and Voter Targeting:
   - Segment the audience based on engagement patterns and demographic indicators. Identify groups such as loyal supporters, swing voters, and the disengaged.
   - Analyze each segment’s potential impact on the election outcome. If any segment is under-targeted or ignored, state this plainly.
   - Provide a brutal assessment of current targeting strategies, quantifying the missed opportunities and recommending precise, data-backed interventions.

5. Tactical Recommendations for Election Domination:
   - Deliver a prioritized, actionable list of radical strategies to overhaul the digital campaign. Recommendations must be precise, with metrics for success.
   - Specify optimal content formats, posting times, and messaging strategies tailored to each audience segment.
   - If existing strategies are failing, do not hesitate to call them out. Recommend alternative tactics that are innovative, aggressive, and measurable.
   - Evaluate potential influencer or partnership opportunities. Analyze past performance data to recommend who to target for maximum impact.

6. Data-Driven Forecasting and Risk Assessment:
   - Forecast the campaign’s social media trajectory based on current trends. Provide best-case and worst-case scenarios with exact figures where possible.
   - Identify critical risks that could derail campaign performance. Offer a no-nonsense contingency plan for each risk.
   - Quantify the potential improvements in voter engagement and turnout from each recommended strategy. Your projections must be detailed and supported by data.

Output Requirements:
- Your final report should be exhaustive, leaving no aspect of the campaign’s digital performance unexamined.
- It must be brutally honest, highlighting every failure and pinpointing every inefficiency.
- Your language should be clear, technical, and direct—suitable for campaign managers who demand immediate, measurable results.
- Focus solely on what will drive the campaign’s success in tangible terms; theoretical discussions or fluff will not suffice.

Remember: Only results matter. Do not compromise on detail. Be as exhaustive and token-rich as possible in your analysis to ensure every opportunity for improvement is exposed and addressed.
    """
    
    # Generate analysis using Gemini
    response = model.generate_content(prompt)
    return response.text

# Function to compare two accounts using Gemini with Deep Comparison Prompt
def compare_accounts_with_gemini(account1_analysis, account2_analysis, account1_data, account2_data):
    # Check if business_discovery exists for both accounts
    if 'business_discovery' not in account1_data or 'business_discovery' not in account2_data:
        print("Error: Missing 'business_discovery' data for one or both accounts.")
        return "Comparison failed due to missing data."

    # Extract details for Account 1
    account1_username = account1_data['business_discovery']['username']
    account1_biography = account1_data['business_discovery'].get('biography', '')
    account1_followers_count = account1_data['business_discovery'].get('followers_count', 0)
    account1_follows_count = account1_data['business_discovery'].get('follows_count', 0)
    account1_media_count = account1_data['business_discovery'].get('media_count', 0)
    account1_media_summary = "\n".join([
        f"- Media ID: {item.get('id', 'N/A')}, "
        f"Caption: {item.get('caption', 'No caption')}, "
        f"Hashtags: {', '.join(item.get('hashtags', [])) or 'No hashtags'}"
        for item in account1_data['business_discovery']['media']['data']
    ])

    # Extract details for Account 2
    account2_username = account2_data['business_discovery']['username']
    account2_biography = account2_data['business_discovery'].get('biography', '')
    account2_followers_count = account2_data['business_discovery'].get('followers_count', 0)
    account2_follows_count = account2_data['business_discovery'].get('follows_count', 0)
    account2_media_count = account2_data['business_discovery'].get('media_count', 0)
    account2_media_summary = "\n".join([
        f"- Media ID: {item.get('id', 'N/A')}, "
        f"Caption: {item.get('caption', 'No caption')}, "
        f"Hashtags: {', '.join(item.get('hashtags', [])) or 'No hashtags'}"
        for item in account2_data['business_discovery']['media']['data']
    ])
    
    # Deep Comparison Prompt
    prompt = f"""
    Execute a ruthless competitive analysis between these political accounts:

    Account 1 Analysis:
    {account1_analysis}

    Account 2 Analysis:
    {account2_analysis}

    Provide a merciless comparison focusing on:
    1. Relative Dominance Metrics
    - Message penetration rates
    - Narrative control effectiveness
    - Psychological manipulation success
    - Demographic control levels
    - Crisis exploitation efficiency
    
    2. Competitive Advantages/Disadvantages
    - Psychological warfare capabilities
    - Narrative warfare effectiveness
    - Demographic control success
    - Crisis exploitation competence
    - Media manipulation abilities

    3. Victory Probability Analysis
    - Head-to-head dominance metrics
    - Resource efficiency comparison
    - Tactical effectiveness rates
    - Strategic superiority measures
    - Overall campaign dominance

    4. Ruthless Recommendations
    - Critical weaknesses to exploit
    - High-impact attack vectors
    - Resource reallocation priorities
    - Immediate tactical adjustments
    - Strategic pivot requirements

    Format as a detailed competitive intelligence briefing with specific metrics, action items, and victory requirements.
    Focus exclusively on achieving absolute dominance and electoral victory.
    """
    
    # Generate comparison using Gemini
    response = model.generate_content(prompt)
    return response.text

# Main function to process multiple usernames
def main():
    usernames_input = input("Enter Instagram usernames (comma-separated): ")
    max_media_count = int(input("Enter the maximum number of media items to fetch per account: "))
    usernames = [username.strip() for username in usernames_input.split(",")]
    
    analyses = {}
    raw_data = {}
    for username in usernames:
        print(f"Fetching up to {max_media_count} media items for @{username}...")
        data = fetch_all_user_data(username, max_media_count)
        
        if data and 'business_discovery' in data:
            # Save raw data to JSON file
            raw_data_file = f"{username}_raw_data.json"
            try:
                with open(raw_data_file, "w", encoding="utf-8") as json_file:
                    json.dump(data, json_file, indent=4, ensure_ascii=False)
                print(f"Raw data for @{username} saved to {raw_data_file}")
            except Exception as e:
                print(f"Error saving raw data for @{username}: {e}")
            
            print(f"Analyzing data for @{username} using Gemini...")
            try:
                analysis = analyze_with_gemini(data)
                analyses[username] = analysis
                raw_data[username] = data
                print(f"Analysis for @{username}:\n{analysis}")
                
                # Save the analysis to a text file
                output_file = f"{username}_analysis.txt"
                with open(output_file, "w", encoding="utf-8") as txt_file:
                    txt_file.write(analysis)
                
                print(f"Analysis for @{username} successfully saved to {output_file}")
            except Exception as e:
                print(f"Error analyzing data for @{username}: {e}")
        else:
            print(f"Failed to fetch or process data for @{username}")
    
    # Save combined raw data for all accounts
    if raw_data:
        combined_data_file = "all_accounts_raw_data.json"
        try:
            with open(combined_data_file, "w", encoding="utf-8") as json_file:
                json.dump(raw_data, json_file, indent=4, ensure_ascii=False)
            print(f"Combined raw data for all accounts saved to {combined_data_file}")
        except Exception as e:
            print(f"Error saving combined raw data: {e}")

    # ...existing comparison code...
    
    # Ask the user if they want to compare accounts
    if len(usernames) > 1:
        compare_choice = input("Do you want to compare the accounts? (yes/no): ").strip().lower()
        if compare_choice == "yes":
            account1_username = usernames[0]
            account2_username = usernames[1]
            
            account1_analysis = analyses.get(account1_username, "No analysis available")
            account2_analysis = analyses.get(account2_username, "No analysis available")
            account1_data = raw_data.get(account1_username, {})
            account2_data = raw_data.get(account2_username, {})
            
            if 'business_discovery' in account1_data and 'business_discovery' in account2_data:
                print(f"Comparing @{account1_username} and @{account2_username} using Gemini...")
                try:
                    comparison = compare_accounts_with_gemini(account1_analysis, account2_analysis, account1_data, account2_data)
                    print(f"Comparison Result:\n{comparison}")
                    
                    # Save the comparison to a text file
                    comparison_output_file = f"{account1_username}_vs_{account2_username}_comparison.txt"
                    with open(comparison_output_file, "w", encoding="utf-8") as txt_file:
                        txt_file.write(comparison)
                    
                    print(f"Comparison successfully saved to {comparison_output_file}")
                except Exception as e:
                    print(f"Error comparing accounts: {e}")
            else:
                print("Error: Missing 'business_discovery' data for one or both accounts.")
                
                
# Run the program
if __name__ == '__main__':
    main()