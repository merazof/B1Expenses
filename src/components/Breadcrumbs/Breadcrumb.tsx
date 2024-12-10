import Link from "next/link";
// import { usePathname } from "next/navigation";
interface BreadcrumbProps {
  pageName: string;
}
const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  // const pathname = usePathname();
  // const links = pathname.split("/").filter((x) => x !== "");
  // if (links.length > 0) links.pop();
  // let enlace = "";

  return (
    <div className="mb-4 rounded-md border border-stroke bg-white p-3 dark:border-strokedark dark:bg-boxdark">
      <div className=" flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-title-sm font-semibold text-black dark:text-white">
          {pageName}
        </h2>

        <nav className="hidden sm:block">
          <ol className="flex items-center gap-2">
            <li>
              <Link className="font-medium" href={"/"}>
                Inicio /
              </Link>
            </li>
            <li className="font-medium text-primary dark:text-primaryClaro">
              {pageName}
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};

export default Breadcrumb;
