import { motion } from 'framer-motion';
import { Church } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="w-16 h-16 rounded-3xl bg-[#176D68] text-white flex items-center justify-center mx-auto"
        >
          <Church size={30}/>
        </motion.div>
        <p className="font-bold mt-5">Miracle Centre</p>
        <p className="text-xs text-[#81918B] mt-1">Loading experience...</p>
      </div>
    </div>
  );
}
