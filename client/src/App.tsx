import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Splash from "./components/Splash";
import { useAuth } from "./contexts/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import Dashboard from "./pages/Dashboard";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";

export default function App() {
  const { isLoading } = useAuth();

  // Show the splash screen while we check localStorage for an existing
  // session, so a logged-in user doesn't briefly flash to /login on refresh.
  if (isLoading) return <Splash />;

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/recipes" element={<RecipeList />} />
      <Route path="/recipes/:id" element={<RecipeDetail />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recipes/new" element={<CreateRecipe />} />
        <Route path="/recipes/:id/edit" element={<EditRecipe />} />
      </Route>
    </Routes>
  );
}