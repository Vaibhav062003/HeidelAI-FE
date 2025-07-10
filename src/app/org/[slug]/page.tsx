"use client";

import DashboardPage from "@/app/dashboard/page";
import React from "react";

export default function OrgSlugPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = React.use(props.params);

  return <DashboardPage orgSlug={slug} />;
}