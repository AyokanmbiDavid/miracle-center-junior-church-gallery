import { Menu, Church, ArrowUpRight } from 'lucide-react';

export default function Header({ open, admin }) {
  return (
    <header className="sticky top-0 z-30 h-[76px] bg-white/90 backdrop-blur-xl border-b border-[#E9EFEC] px-4 sm:px-7 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={open}
          className="lg:hidden w-10 h-10 rounded-xl bg-[#F1F5F3] flex items-center justify-center"
        >
          <Menu size={20}/>
        </button>

        <div>
          <p className="text-[10px] uppercase tracking-[.16em] font-bold text-[#81918B]">
            Miracle Centre
          </p>
          <p className="text-sm font-bold">
            {admin ? 'Administration' : 'Junior Church'}
          </p>
        </div>
      </div>

      <a
        href="/"
        className="flex items-center gap-2 bg-[#E4F2EF] text-[#176D68] rounded-xl px-3 py-2.5 text-xs font-bold"
      >
        <Church size={16}/>
        <span className="hidden sm:block">Visit website</span>
        <ArrowUpRight size={14}/>
      </a>
    </header>
  );
}
