import { NavLink, useLocation } from 'react-router-dom';
import { Church, X } from 'lucide-react';
import { navigation } from '../app/navigation';

export default function Sidebar({ close }) {
  const location = useLocation();

  return (
    <aside className="h-full bg-white border-r border-[#E9EFEC] flex flex-col">
      <div className="h-[78px] px-5 flex items-center justify-between border-b border-[#E9EFEC]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#176D68] text-white flex items-center justify-center">
            <Church size={23}/>
          </div>
          <div>
            <h2 className="font-extrabold text-sm">MIRACLE CENTRE</h2>
            <p className="text-[10px] text-[#81918B] tracking-wider">
              JUNIOR CHURCH
            </p>
          </div>
        </div>

        <button onClick={close} className="lg:hidden p-2">
          <X size={19}/>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-8">
        {navigation.map(section => (
          <section key={section.title}>
            <p className="text-[10px] tracking-[.16em] font-bold text-[#9AA8A2] px-3 mb-3">
              {section.title}
            </p>

            <div className="space-y-1">
              {section.items.map(item => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/' || item.path === '/admin'}
                    onClick={close}
                    className={({ isActive }) => {
                      const active = isActive ||
                        (item.path !== '/' &&
                         item.path !== '/admin' &&
                         location.pathname.startsWith(item.path + '/'));

                      return `flex items-center gap-3 px-3 py-3 rounded-2xl text-[13px] font-semibold transition-all ${
                        active
                          ? 'bg-[#E4F2EF] text-[#176D68]'
                          : 'text-[#81918B] hover:bg-[#F5F8F6] hover:text-[#20302D]'
                      }`;
                    }}
                  >
                    <Icon size={18}/>
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="p-4 border-t border-[#E9EFEC]">
        <div className="p-4 rounded-2xl bg-[#F5F8F6]">
          <p className="text-xs font-bold">Our memories matter.</p>
          <p className="text-[11px] text-[#81918B] mt-1 leading-relaxed">
            Preserving the moments that make our community special.
          </p>
        </div>
      </div>
    </aside>
  );
}
