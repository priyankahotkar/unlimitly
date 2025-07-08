import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const CreateWorkspace = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { user } = auth || {};

  const [orgName, setOrgName] = useState("");
  const [location, setLocation] = useState("");
  const [numEmployees, setNumEmployees] = useState("");
  const [numTeams, setNumTeams] = useState("");
  const [teamCapacities, setTeamCapacities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Update team capacities array when number of teams changes
  const handleNumTeamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNumTeams(value);
    const n = parseInt(value, 10) || 0;
    setTeamCapacities((prev) => {
      const arr = [...prev];
      if (arr.length < n) {
        return arr.concat(Array(n - arr.length).fill(""));
      } else {
        return arr.slice(0, n);
      }
    });
  };

  const handleTeamCapacityChange = (idx: number, value: string) => {
    setTeamCapacities((prev) => {
      const arr = [...prev];
      arr[idx] = value;
      return arr;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    if (!user) {
      setError("You must be logged in to create a workspace.");
      setLoading(false);
      return;
    }
    if (!orgName || !location || !numEmployees || !numTeams || teamCapacities.some((c) => !c)) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    try {
      await addDoc(collection(db, "startups"), {
        organizationName: orgName,
        location,
        numberOfEmployees: Number(numEmployees),
        numberOfTeams: Number(numTeams),
        teamCapacities: teamCapacities.map(Number),
        createdAt: serverTimestamp(),
        owner: {
          uid: user.uid,
          name: user.displayName || user.email,
          email: user.email,
        },
      });
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      setError("Failed to create workspace. Please try again.");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to create a workspace.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Startup Workspace
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Organization Name</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Number of Employees</label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={numEmployees}
              onChange={(e) => setNumEmployees(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Number of Teams</label>
            <input
              type="number"
              min="1"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={numTeams}
              onChange={handleNumTeamsChange}
              required
            />
          </div>
          {teamCapacities.length > 0 && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">Team Capacities</label>
              <div className="grid grid-cols-1 gap-2">
                {teamCapacities.map((cap, idx) => (
                  <input
                    key={idx}
                    type="number"
                    min="1"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Capacity for Team ${idx + 1}`}
                    value={cap}
                    onChange={(e) => handleTeamCapacityChange(idx, e.target.value)}
                    required
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {success && <p className="text-green-600 mt-4 text-center">Workspace created successfully!</p>}
        <button
          type="submit"
          className="w-full py-3 px-4 mt-6 rounded text-white font-bold bg-blue-600 hover:bg-blue-700 transition duration-200 disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Workspace"}
        </button>
      </form>
    </div>
  );
};

export default CreateWorkspace; 