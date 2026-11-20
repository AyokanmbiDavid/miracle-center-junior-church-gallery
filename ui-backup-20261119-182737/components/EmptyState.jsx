import { Images } from 'lucide-react';

export default function EmptyState({ title = 'Nothing here yet', description = 'New content will appear here when available.' }) {
  return (
    <div className="bg-white border border-[#E9EFEC] rounded-[28px] p-12 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#E4F2EF] text-[#176D68] flex items-center justify-center mx-auto">
        <Images size={24}/>
      </div>
      <h3 className="font-bold mt-4">{title}</h3>
      <p className="text-sm text-[#81918B] mt-2">{description}</p>
    </div>
  );
}
