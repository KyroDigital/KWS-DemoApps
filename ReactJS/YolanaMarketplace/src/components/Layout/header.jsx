import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getInitials, isObject } from 'helpers';
import { useAuth } from 'hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setLocalStorage } from 'utils';

const NavLink = (props) => <Link {...props} />;

const Header = function () {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const mobileMenuRef = useRef();

  const closeOpenMenus = useCallback(
    (e) => {
      if (
        mobileMenuRef.current &&
        showMenu &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    },
    [showMenu],
  );

  useEffect(() => {
    document.addEventListener('mousedown', closeOpenMenus);
  }, [closeOpenMenus]);

  useEffect(() => {
    const header = document.getElementById('myHeader');
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener('scroll', () => {
      if (window.pageYOffset > sticky) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
    return () => {
      window.removeEventListener('scroll', scrollCallBack);
    };
  }, []);

  return (
    <header id='myHeader' className='navigationBar white py-2'>
      <div className='container'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <div className='logo px-0'>
            <div
              className='navigationBar-title navigationBar-item'
              style={{ height: '100%', width: '10ch' }}>
              <NavLink to='/'>
                <img
                  src={require('../../assets/images/logo2.png')}
                  className='img-fluid d-block ml-md-4'
                  alt='#'
                />
              </NavLink>
            </div>
          </div>

          <div style={{ display: 'flex' }}>
            <div
              className='btn-main'
              onClick={() => {
                setLocalStorage('path', '/create');
                navigate('/create');
              }}>
              Create NFT
            </div>
            {isObject(currentUser) ? (
              <div className='dropdown' ref={mobileMenuRef}>
                <div
                  className='centered avatar_small'
                  onClick={() => setShowMenu(!showMenu)}>
                  {getInitials(
                    `${currentUser.first_name} ${currentUser.last_name}`,
                  )}
                </div>
                {showMenu && (
                  <div className='dropdown-options'>
                    <div>
                      <i className='fa fa-sign-out' style={{}} />
                    </div>
                    <div onClick={logOut} style={{ marginLeft: 5 }}>
                      Logout
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div
                className='btn-sec'
                style={{ marginLeft: '1rem' }}
                onClick={() => {
                  setLocalStorage('path', location.pathname);
                  navigate('/signin');
                }}>
                Sign In
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
