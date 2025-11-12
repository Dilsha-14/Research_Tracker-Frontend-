import NavigationBar from "../components/Layout/NavigationBar";

const Dashboard = () => {
  return (
    <div>
      <NavigationBar />
      <div className="p-5">
        <h1 className="text-3xl font-semibold">Welcome to the Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Access your projects, milestones, and documents easily.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;