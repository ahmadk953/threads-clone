"use client";

import useSWR from "swr";
import AccountProfile from "@/components/forms/AccountProfile";
import { useOrganization } from "@clerk/nextjs";
import { NextPage } from "next";

interface CommunityData {
  id: string;
  objectId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
}

const fetcher = (url: string, headers: HeadersInit) =>
  fetch(url, { headers }).then((res) => {
    if (!res.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    return res.json();
  });

const Page: NextPage = () => {
  const { organization } = useOrganization();
  const currentOrg = organization?.id || "";

  const { data, error } = useSWR<CommunityData, any>(
    '/api/communities',
    (url: string) => fetcher(url, { 'organization-id': currentOrg })
  );

  if (error) {
    console.log(error);
    return <div className="head-text">Failed to load community data - Please try again or check your browser console for more details</div>;
  }

  if (!data) {
    return <div className="head-text">Loading...</div>;
  }

  return (
    <>
      <h1 className="head-text">Edit Community</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Make any changes to your community
      </p>

      <section className="mt-12">
        <AccountProfile user={data} btnTitle="Continue" type="Community" />
      </section>
    </>
  );
};

export default Page;
