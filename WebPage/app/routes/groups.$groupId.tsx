// groups.$groupId.tsx
import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, json, useLoaderData } from "@remix-run/react";
import { group } from "console";
import React from "react";
import { useParams } from "react-router-dom";
import { getGroupByName } from "~/models/groups.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { groupId } = params;

  if (!groupId) {
    throw new Error("Group ID is missing");
  }
  const groupInfo = await getGroupByName(groupId);

  return json(groupInfo);
};

const GroupDetailPage = () => {
  const { groupId } = useParams();
  const groupInfo = useLoaderData<typeof loader>();

  return (
    <>
      <div className="pt-2 pl-6 pr-6 pb-6 bg-custom-200 text-medium mt-3 ml-3 mr-1 w-full md:w-[calc(100% - 360px)]">
        <ul className="flex flex-wrap -mb-px border-b border-gray-200 pb-3">
          <div>
            <h1 className="font-bold text-2xl pt-4 pl-3">
              Peržiūrite grupę kurios pavadinimas: {groupId}
            </h1>
          </div>
        </ul>
        <div>
          <h1 className="font-bold text-1xl pt-4 pl-3 text-wrap">
            Grupės aprašymas:
          </h1>
          <h1 className=" text-1xl pt-1 pl-3 text-wrap">
            {groupInfo?.groupFullDescription}
          </h1>
        </div>
        <div>
          <h1 className="font-bold text-1xl pt-4 pl-3"></h1>
        </div>
      </div>

      <div className="p-6 bg-custom-200 text-medium mt-3 mr-3 ">
        <div className="flex justify-center pb-2">
          <Link
            className="w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap"
            to={"new"}
          >
            Peržiūrėti narius
          </Link>
        </div>
        <div className="flex justify-center pb-2">
          <Link
            className="w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap"
            to={"new"}
          >
            Keisti nustatymus
          </Link>
        </div>
        <div className="flex justify-center pb-2">
          <Link
            className="w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap"
            to={"new"}
          >
            Keisti nustatymus
          </Link>
        </div>
        <div className="flex justify-center pb-2">
          <Link
            className="w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap"
            to={"new"}
          >
            Keisti nustatymus
          </Link>
        </div>
        <div className="flex justify-center pb-2">
          <Link
            className="w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap"
            to={"new"}
          >
            Keisti nustatymus
          </Link>
        </div>
        <div className="flex justify-center pb-2">
          <Link
            className="w-full cursor-pointer bg-custom-800 hover:bg-custom-850 text-white font-bold py-2 px-8 rounded text-nowrap"
            to={"new"}
          >
            Keisti nustatymus
          </Link>
        </div>
      </div>
    </>
  );
};

export default GroupDetailPage;
