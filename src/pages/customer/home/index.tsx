
import About from "../../../components/molecules/about/About";
import CustomerFeedback from "../../../components/organisms/customer-feedback/CustomerFeedback";
import HomeCarousel from "../../../components/molecules/home-carousel";
import BookingSection from "../../../components/organisms/booking-section/BookingSection";
import DoctorList from "../../../components/organisms/doctor-list/DoctorList";
import OutStandingService from "../../../components/organisms/outstanding-service/OutStandingService";
import ServiceAtNestCare from "../../../components/organisms/service-at-nest-care/ServiceAtNestCare";
import HealthKnowledge from "../../../components/organisms/health-knowledge/HealthKnowledge";
import InformationForCustomer from "../../../components/organisms/infomation-for-customer/InformationForCustomer";
import LearnMoreAboutNestCare from "../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare";

const HomePage = () => {
  

  return (
    <>
      <HomeCarousel />
      <div className="container mx-auto mt-5">
        <About />
        <ServiceAtNestCare/>
        <DoctorList />
        <BookingSection />
        <OutStandingService/>
        <CustomerFeedback/>
        <HealthKnowledge/>
        <InformationForCustomer/>
        <LearnMoreAboutNestCare/>
      </div>
    </> 
  );
};

export default HomePage;
