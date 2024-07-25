import { lazy } from "react";

const Dashboard = lazy(() => import("../pages/protected/Dashboard"));
const Welcome = lazy(() => import("../pages/protected/Welcome"));
const Page404 = lazy(() => import("../pages/protected/404"));
const Blank = lazy(() => import("../pages/protected/Blank"));
const Charts = lazy(() => import("../pages/protected/Charts"));
const Leads = lazy(() => import("../pages/protected/Leads"));
const Integration = lazy(() => import("../pages/protected/Integration"));
const Calendar = lazy(() => import("../pages/protected/Calendar"));
const Team = lazy(() => import("../pages/protected/Team"));
const Transactions = lazy(() => import("../pages/protected/Transactions"));
const Bills = lazy(() => import("../pages/protected/Bills"));
const ProfileSettings = lazy(() =>
  import("../pages/protected/ProfileSettings")
);
const GettingStarted = lazy(() => import("../pages/GettingStarted"));
const DocFeatures = lazy(() => import("../pages/DocFeatures"));
const DocComponents = lazy(() => import("../pages/DocComponents"));
const DocumentManager = lazy(() =>
  import("../pages/protected/DocumentManager")
);
const FolderDetails = lazy(() => import("../pages/protected/FolderDetails")); // Add this line for FolderDetails component
const DocViewer = lazy(() => import("../pages/protected/DovViewer"));
const DocGenerator = lazy(() => import("../pages/protected/DocGenerator"));
const ExcelViewer = lazy(() => import("../pages/protected/ExcelViewer"));
const SalesProgress = lazy(() => import("../pages/protected/SalesProgress"));
const Inventory = lazy(() => import("../pages/protected/GMTInventory"));
const InventoryLog = lazy(() => import("../pages/protected/InventoryLog"));
const DocumentForm = lazy(() => import("../pages/protected/DocumentForm"));

const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/welcome", // the url
    component: Welcome, // view rendered
  },
  {
    path: "/leads",
    component: Leads,
  },
  {
    path: "/settings-team",
    component: Team,
  },
  {
    path: "/calendar",
    component: Calendar,
  },
  {
    path: "/transactions",
    component: Transactions,
  },
  {
    path: "/inventory",
    component: Inventory,
  },
  {
    path: "/inventory/:inventoryId",
    component: InventoryLog,
  },
  {
    path: "/documentmanager",
    component: DocumentManager,
  },
  {
    path: "/documentform",
    component: DocumentForm,
  },
  {
    path: "/docgenerator",
    component: DocGenerator,
  },
  {
    path: "/documentmanager/:folderId",
    component: FolderDetails,
  },
  {
    path: "/salesprogress",
    component: SalesProgress,
  },
  {
    path: "/viewPdf",
    component: DocViewer,
  },
  {
    path: "/viewExcel",
    component: ExcelViewer,
  },
  {
    path: "/settings-profile",
    component: ProfileSettings,
  },
  {
    path: "/settings-billing",
    component: Bills,
  },

  {
    path: "/getting-started",
    component: GettingStarted,
  },
  {
    path: "/features",
    component: DocFeatures,
  },
  {
    path: "/components",
    component: DocComponents,
  },
  {
    path: "/integration",
    component: Integration,
  },
  {
    path: "/charts",
    component: Charts,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/blank",
    component: Blank,
  },
];

export default routes;
