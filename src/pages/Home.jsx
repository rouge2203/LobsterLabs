import { motion } from "framer-motion";
import { LanguageProvider } from "../components/i18n/LanguageContext";
import { MainScreen } from "../components/MainScreen/MainScreen";

const Home = () => {
  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen bg-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1"
        >
          <MainScreen />
        </motion.div>
      </div>
    </LanguageProvider>
  );
};

export default Home;
