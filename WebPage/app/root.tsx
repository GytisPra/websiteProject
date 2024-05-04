import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "@remix-run/react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";
import NavBar from "./components/common/NavBar/NavBar";
import { useEffect, useState } from "react";
import NavBarHeader from "./components/common/NavBar/NavBarHeader";
import { useOptionalUser } from "./utils";
import NewFooter from "./components/newFooter/NewFooter";
import { getUserNotifications } from "./models/notification.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await getUser(request);

  if (!user) {
    return typedjson({ user: null, notifications: null });
  }

  return typedjson({
    notifications: await getUserNotifications(user.id),
    user: user,
  });
};

export default function App() {
  const [activeTab, setActiveTab] = useState("");
  const [headerTitle, setHeaderTitle] = useState("Loading...");
  const [showNavigation, setShowNavigation] = useState(false);
  const user = useOptionalUser();

  const loaderData = useTypedLoaderData<typeof loader>();

  const location = useLocation();

  useEffect(() => {
    setShowNavigation(true);

    switch (location.pathname) {
      case "/admin":
      case "/":
      case "/ban":
      case "/join":
      case "/login":
      case "/contractExpired":
        setShowNavigation(false);
        break;
      case "/orders":
        setHeaderTitle("Užsakymų sąrašas");
        break;
      case "/dashboard":
        setHeaderTitle("Dashboard");
        break;
      case "/orders/new":
        setHeaderTitle("Užsakymo sukurimas");
        break;
      case "/calender":
        setHeaderTitle("Darbų Kalendorius");
        break;
      case "/FAQ":
        setHeaderTitle("Dažnai užduodami klausimai");
        break;
      case "/groups":
        setHeaderTitle("Grupės");
        break;
      case "/groups/new":
        setHeaderTitle("Sukurti grupę");
        break;
      case "/workerAds":
        setHeaderTitle("Reklamos");
        break;
      case "/workerAds/new":
        setHeaderTitle("Sukurti reklamą");
        break;
      default:
        setHeaderTitle("Not Found 404");
        break;
    }

    if (location.pathname.startsWith("/profile")) {
      setHeaderTitle("Profilis");
    }

    if (
      location.pathname.match("/workerAds/[a-zA-Z0-9]+$") &&
      !location.pathname.endsWith("new")
    ) {
      setHeaderTitle("Reklama");
    }
  }, [location.pathname]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        {showNavigation ? (
          <div className="flex h-screen w-screen bg-custom-100 overflow-auto">
            <div className="navbar-container">
              <NavBar
                title={"Žemaičiai"}
                handleTabClick={handleTabClick}
                redirectTo={"dashboard"}
                activeTab={activeTab}
                tabTitles={{
                  orders: "Užsakymai",
                  admin: "Admin panel",
                  messages: "Žinutės",
                  [`profile/${user?.id}`]: "Profilis",
                  calender: "Kalendorius",
                  FAQ: "D.U.K",
                  groups: "Grupės",
                  questioner: "Klausimai",
                  workerAds: "Reklamos",
                }}
              />
            </div>
            <div className="w-screen h-screen flex flex-col bg-custom-100 overflow-auto">
              <NavBarHeader
                title={headerTitle}
                notifications={loaderData.notifications}
              />
              <div className="flex flex-col justify-between h-full">
                <Outlet />
                <NewFooter />
              </div>
            </div>
          </div>
        ) : (
          <Outlet />
        )}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
