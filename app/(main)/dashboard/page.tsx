
import FileUpload from "../../_components/FileUpload";

const Dashboard = () => {

  return (
    <div className="w-full h-full flex gap-2">
      <div className="w-full md:w-1/2 lg:w-3/4 h-full flex-1">
        check
      </div>
      <div className="w-full md:w-1/2 lg:w-1/4 h-full bg-violet p-4">
      <h1 className="text-brown text-base font-medium text-right mb-4">Services</h1>
        <FileUpload />
        <div className="flex-1">
          Avtivites
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
