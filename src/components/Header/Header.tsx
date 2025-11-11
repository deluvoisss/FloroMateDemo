import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import flower1 from '../../assets/flowers1.jpg';
import flower2 from '../../assets/flowers2.jpg';
import flower3 from '../../assets/flowers3.jpg';
import flower4 from '../../assets/flowers4.jpg';
import flower5 from '../../assets/flowers5.jpg';
import './Header.css';

// Вынесено за пределы компонента
const flowers = [flower1, flower2, flower3, flower4, flower5];

const Header: React.FC = () => {
  const location = useLocation();
  const coinRef = useRef<HTMLDivElement>(null);
  const [currentFlowerIndex, setCurrentFlowerIndex] = useState(0);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const triggerSpin = () => {
      if (coinRef.current) {
        coinRef.current.classList.remove('spinning');
        void coinRef.current.offsetWidth; // триггер перерисовки
        coinRef.current.classList.add('spinning');
        setCurrentFlowerIndex((prev) => (prev + 1) % flowers.length);
      }
    };
  
    let inactivityTimeout: NodeJS.Timeout | null = null;
    let spinInterval: NodeJS.Timeout | null = null;
  
    const stopSpinning = () => {
      if (spinInterval) {
        clearInterval(spinInterval);
        spinInterval = null;
      }
    };
  
    const startSpinning = () => {
      if (!spinInterval) {
        spinInterval = setInterval(triggerSpin, 5000);
      }
    };
  
    const resetInactivityTimer = (e: MouseEvent) => {
      const movedSignificantly =
        Math.abs(e.clientX - lastMousePos.current.x) > 5 || 
        Math.abs(e.clientY - lastMousePos.current.y) > 5;
  
      if (movedSignificantly) {
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        stopSpinning();
  
        if (inactivityTimeout) {
          clearTimeout(inactivityTimeout);
        }
  
        inactivityTimeout = setTimeout(() => {
          startSpinning();
        }, 15000);
      }
    };
  
    triggerSpin();
    document.addEventListener('mousemove', resetInactivityTimer);
  
    return () => {
      document.removeEventListener('mousemove', resetInactivityTimer);
      if (inactivityTimeout) {
        clearTimeout(inactivityTimeout);
      }
      if (spinInterval) {
        clearInterval(spinInterval);
      }
    };
  }, []); // Пустой массив зависимостей

  // Проверка активности меню "Узнать по фото"
  const isRecognitionActive = location.pathname === '/recognition1' || 
                               location.pathname === '/recognition2';

  // Проверка активности меню "Мастерская ландшафта"
  const isLandscapeActive = location.pathname === '/landscapedesign' || 
                             location.pathname === '/konstructor';

  const handleMenuEnter = (menu: string) => {
    setOpenMenu(menu);
  };

  const handleMenuLeave = () => {
    setOpenMenu(null);
  };

  return (
    <header className="header">
      <div className="header-container">
        <ul className='header-nav'>
          {/* Справочник растений */}
          <li>
            <Link 
              to="/encyclopedia" 
              className={`nav-link ${location.pathname === '/encyclopedia' ? 'active' : ''}`}
            >
              Справочник растений
            </Link>
          </li>

          {/* Узнать по фото */}
          <li
            onMouseEnter={() => handleMenuEnter('photo')}
            onMouseLeave={handleMenuLeave}
            style={{ position: 'relative' }}
          >
            <Link 
              to="/recognition1" 
              className={`nav-link ${isRecognitionActive ? 'active' : ''}`}
            >
              Узнать по фото
            </Link>
            <div className={`popup-menu ${openMenu === 'photo' ? 'active' : ''}`}>
              <ul>
                <li>
                  <Link to="/recognition1">Распознать растение</Link>
                </li>
                <li>
                  <Link to="/recognition2">Определить болезнь</Link>
                </li>
              </ul>
            </div>
          </li>

          {/* Мастерская ландшафта */}
          <li 
            onMouseEnter={() => handleMenuEnter('landscape')}
            onMouseLeave={handleMenuLeave}
            style={{ position: 'relative' }}
          >
            <Link 
              to="/landscapedesign" 
              className={`nav-link ${isLandscapeActive ? 'active' : ''}`}
            >
              Мастерская ландшафта
            </Link>

            <div className={`popup-menu ${openMenu === 'landscape' ? 'active' : ''}`}>
              <ul>
                <li>
                  <Link to="/landscapedesign">Ландшафт по фото</Link>
                </li>
                <li>
                  <Link to="/konstructor">Конструктор</Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>

        {/* Логотип в центре */}
        <Link to="/mainpage" className="nav-link-logo" aria-label="Главная страница">
          <div ref={coinRef} className="coin">
            <div className="coin-face coin-front">
              <img src={logo} alt="Logo" />
            </div>
            <div className="coin-face coin-back">
              <img src={flowers[currentFlowerIndex]} alt="Logo Back" />
            </div>
          </div>
        </Link>

        {/* Правая навигация */}
        <ul className='header-nav'>
          <li>
            <Link
              to="/ourteam"
              className={`nav-link ${location.pathname === '/ourteam' ? 'active' : ''}`}
            >
              Наша команда
            </Link>
          </li>
          <li>
            <Link
              to="/privategarden"
              className={`nav-link ${location.pathname === '/privategarden' ? 'active' : ''}`}
            >
              Личный сад
            </Link>
          </li>
          <li>
            <Link
              to="/subscription"
              className={`nav-link ${location.pathname === '/subscription' ? 'active' : ''}`}
            >
              Премиум-доступ
            </Link>
          </li>
          <li>
            <Link 
              to="/auth"
              className="login-button"
              aria-label="Войти в аккаунт"
            >
              Войти
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default React.memo(Header);