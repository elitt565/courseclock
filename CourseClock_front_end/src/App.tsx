/**
 * This function takes in a number and returns its square.
 * @param {number} num - The number to be squared.
 * @returns {number} The square of the input number.
 */
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import { RequireAuth, useAuthUser } from 'react-auth-kit';
import './styles/App.css';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Sidebar from './pages/SideBar';
import Calendar from './components/Calendar';
import ScheduleLogo from './assets/Schedule.svg';
import OfficeHoursLogo from './assets/OfficeHoursLogo.svg'
import RecommendedLogo from './assets/RecommendedLogo.svg'
import Recommended from './pages/Recommended';
import PageNotFound from './pages/PageNotFound';
import NotAllowed from './pages/NotAllowed';
import DisplaySchedule from './pages/DisplaySchedule';
import NotFound from './pages/NotFound';

function App() {
  const authUser = useAuthUser();
  const id = authUser()?.id;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={"/signin"}/>} />
        <Route path="signin" element={<Signin />} />
        <Route path="signup" element={<Signup />} />
        <Route path="student" element={authUser() ? <Navigate to={`/student/${id}`}/> : <Navigate to={"/signin"}/>} />
        <Route path="student/:id" element={<RequireAuth loginPath="/signin"><Sidebar 
          pages={[
            {
              name: "OfficeHours",
              path: `/student/${id}/officeHours`,
              logo: <img height={34} width={34} src={OfficeHoursLogo} alt="officeHours Logo" />,
            },
            {
              name: "Schedule",
              path: `/student/${id}/schedule`,
              logo: <img height={34} width={34} src={ScheduleLogo} alt="Schedule Logo" />,
            },
          ]}
        /></RequireAuth>}>
          <Route path="schedule" element={<Calendar/>} />
          <Route path="officeHours" element={<DisplaySchedule/>} />
          <Route path="*" element={<NotFound/>} />
        </Route>
        <Route path="instructor" element={authUser() ? <Navigate to={`/instructor/${id}`}/> : <Navigate to={"/signin"}/>} />
        <Route path="instructor/:id" element={<RequireAuth loginPath="/signin"><Sidebar
          pages={[
            {
              name: "OfficeHours",
              path: `/instructor/${id}/officeHours`,
              logo: <img height={34} width={34} src={OfficeHoursLogo} alt="officeHours Logo" />,
            },
            {
              name: "Schedule",
              path: `/instructor/${id}/schedule`,
              logo: <img height={34} width={34} src={ScheduleLogo} alt="Schedule Logo" />,
            },
            {
              name: "Recommended",
              path: `/instructor/${id}/recommended`,
              logo: <img height={34} width={34} src={RecommendedLogo} alt="Recommended Hours Logo" />,
            },
          ]}
        /></RequireAuth>}>
          <Route path="schedule" element={<Calendar/>} />
          <Route path="officeHours" element={<DisplaySchedule/>} />
          <Route path="recommended" element={<Recommended/>} />
          <Route path="*" element={<NotFound/>} />
        </Route>
        {/* Fallback Route */}
        <Route path='/not-allowed' element={<NotAllowed/>} />
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    </Router>
  );
}

export default App;
