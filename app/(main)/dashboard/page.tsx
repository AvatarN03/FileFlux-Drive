
import FileLists from "../_components/FileLists";
import Folders from "../_components/Folders";

const Dashboard = () => { 

  return (
    <div className="w-full h-full flex flex-col gap-4 justify-around items-start">
      {/* folders  */}
      <div className="w-full">
        <Folders limit={5} />
      </div>

      {/* files  */}
      <div className="w-full mb-14 pb-10">
        <FileLists  limit={5}/>
      </div>

    </div>
  );
};

export default Dashboard;
