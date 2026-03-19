import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";

import Login            from "./pages/auth/Login.jsx";
import Home             from "./pages/public/Home.jsx";
import Leaderboard      from "./pages/public/Leaderboard.jsx";
import GameDetail       from "./pages/public/GameDetail.jsx";
import CategoryView     from "./pages/public/CategoryView.jsx";
import PublicGameView   from "./pages/public/PublicGameView.jsx";
import AdminDashboard   from "./pages/admin/AdminDashboard.jsx";
import ManageGames      from "./pages/admin/ManageGames.jsx";
import AdminGameDetail  from "./pages/admin/AdminGameDetail.jsx";
import PublishGames     from "./pages/admin/PublishGames.jsx";
import ResetLeaderboard from "./pages/admin/ResetLeaderboard.jsx";
import JudgeDashboard   from "./pages/judge/JudgeDashboard.jsx";
import SubmitSingle     from "./pages/judge/SubmitSingle.jsx";
import SubmitMultiple   from "./pages/judge/SubmitMultiple.jsx";
import SubmitByGame     from "./pages/judge/SubmitByGame.jsx";
import NotFound         from "./pages/NotFound.jsx";
import ProtectedRoute   from "./components/ProtectedRoute.jsx";

const App = () => {
  const { adminUser, judgeUser, loading } = useAuth();

  if (loading) return (
    <div className="loading-screen"><div className="spinner" /></div>
  );

  return (
    <Routes>
      {/* Auth */}
     <Route path="/login" element={<Login />} />

      {/* Public */}
      <Route path="/"                        element={<Home />} />
      <Route path="/leaderboard"             element={<Leaderboard />} />
      <Route path="/public/:token"           element={<PublicGameView />} />
      <Route path="/games/:gameId"           element={<GameDetail />} />
      <Route path="/games/:category/:gender" element={<CategoryView />} />

      {/* Admin */}
      <Route element={<ProtectedRoute role="admin" />}>
        <Route path="/admin"               element={<AdminDashboard />} />
        <Route path="/admin/games"         element={<ManageGames />} />
        <Route path="/admin/games/:gameId" element={<AdminGameDetail />} />
        <Route path="/admin/publish"       element={<PublishGames />} />
        <Route path="/admin/reset"         element={<ResetLeaderboard />} />
      </Route>

      {/* Judge */}
      <Route element={<ProtectedRoute role="judge" />}>
        <Route path="/judge"               element={<JudgeDashboard />} />
        <Route path="/judge/submit"        element={<SubmitSingle />} />
        <Route path="/judge/submit/batch"  element={<SubmitMultiple />} />
        <Route path="/judge/submit/bygame" element={<SubmitByGame />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;

// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext.jsx";

// import Login           from "./pages/auth/Login.jsx";
// import Home            from "./pages/public/Home.jsx";
// import Leaderboard     from "./pages/public/Leaderboard.jsx";
// import GameDetail      from "./pages/public/GameDetail.jsx";
// import CategoryView    from "./pages/public/CategoryView.jsx";
// import PublicGameView  from "./pages/public/PublicGameView.jsx";
// import AdminDashboard  from "./pages/admin/AdminDashboard.jsx";
// import ManageGames     from "./pages/admin/ManageGames.jsx";
// import AdminGameDetail from "./pages/admin/AdminGameDetail.jsx";
// import PublishGames    from "./pages/admin/PublishGames.jsx";
// import ResetLeaderboard from "./pages/admin/ResetLeaderboard.jsx";
// import JudgeDashboard  from "./pages/judge/JudgeDashboard.jsx";
// import SubmitSingle    from "./pages/judge/SubmitSingle.jsx";
// import SubmitMultiple  from "./pages/judge/SubmitMultiple.jsx";
// import SubmitByGame    from "./pages/judge/SubmitByGame.jsx";
// import NotFound        from "./pages/NotFound.jsx";
// import ProtectedRoute  from "./components/ProtectedRoute.jsx";

// const App = () => {
//   const { user, loading } = useAuth();

//   if (loading) return (
//     <div className="loading-screen"><div className="spinner" /></div>
//   );

//   return (
//     <Routes>
//       {/* Auth */}
//       <Route path="/login" element={
//         user ? <Navigate to={user.role === "admin" ? "/admin" : "/judge"} replace /> : <Login />
//       } />

//       {/* Public */}
//       <Route path="/"                           element={<Home />} />
//       <Route path="/leaderboard"                element={<Leaderboard />} />
//       <Route path="/public/:token"              element={<PublicGameView />} />
//       <Route path="/games/:gameId"              element={<GameDetail />} />
//       <Route path="/games/:category/:gender"    element={<CategoryView />} />

//       {/* Admin */}
//       <Route element={<ProtectedRoute role="admin" />}>
//         <Route path="/admin"                    element={<AdminDashboard />} />
//         <Route path="/admin/games"              element={<ManageGames />} />
//         <Route path="/admin/games/:gameId"      element={<AdminGameDetail />} />
//         <Route path="/admin/publish"            element={<PublishGames />} />
//         <Route path="/admin/reset"              element={<ResetLeaderboard />} />
//       </Route>

//       {/* Judge */}
//       <Route element={<ProtectedRoute role="judge" />}>
//         <Route path="/judge"                    element={<JudgeDashboard />} />
//         <Route path="/judge/submit"             element={<SubmitSingle />} />
//         <Route path="/judge/submit/batch"       element={<SubmitMultiple />} />
//         <Route path="/judge/submit/bygame"      element={<SubmitByGame />} />
//       </Route>

//       {/* 404 */}
//       <Route path="*" element={<NotFound />} />
//     </Routes>
//   );
// };

// export default App;