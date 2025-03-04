
import About from "../../../components/molecules/about/About";
import CustomerFeedback from "../../../components/organisms/customer-feedback/CustomerFeedback";
import HomeCarousel from "../../../components/molecules/home-carousel";
import BookingSection from "../../../components/organisms/booking-section/BookingSection";
import DoctorList from "../../../components/organisms/doctor-list/DoctorList";
import OutStandingService from "../../../components/organisms/outstanding-service/OutStandingService";
import ServiceAtNestCare from "../../../components/organisms/service-at-nest-care/ServiceAtNestCare";
import HealthKnowledge from "../../../components/organisms/health-knowledge/HealthKnowledge";
import LearnMoreAboutNestCare from "../../../components/organisms/learn-more-about-nest-care/LearnMoreAboutNestCare";
import InformationForCustomer from "../../../components/organisms/information-for-customer/InformationForCustomer";

const HomePage = () => {

  return (
    <div className="mx-5">
      <HomeCarousel />
      <div className="container mx-auto mt-5">
        <ServiceAtNestCare />
        <About />
        <DoctorList />
        <BookingSection />
        <OutStandingService />
        <CustomerFeedback />
        <HealthKnowledge />
        <InformationForCustomer />
        <LearnMoreAboutNestCare />
      </div>
    </div>
  );
};

export default HomePage;
