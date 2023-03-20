import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getInitials, isObject } from 'helpers';
import { useAuth } from 'hooks';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from 'context';
import { setLocalStorage } from 'utils';

const NavLink = (props) => <Link {...props} />;

const Header = function () {
  const navigate = useNavigate();
  const { currentUser, logOut } = useAuth();
  const { theme } = React.useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
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
  return (
    <header
      id='myHeader'
      className='navigationBar white py-2'
      style={{ backgroundColor: theme.header.bgColor }}>
      <div className='container'>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <NavLink to='/'>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}>
              <img
                src={require('../../assets/images/logo.png')}
                style={{ height: 40, width: 40, objectFit: 'cover' }}
              />
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 500,
                  marginLeft: '1rem',
                }}
                className='color'>
                UTOPIA COFFEE
              </div>
            </div>
          </NavLink>

          <div style={{ display: 'flex' }}>
            <div
              className='btn-main'
              onClick={() => {
                navigate('/create');
                setLocalStorage('path', '/create');
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
                  navigate('/signin');
                  console.log(location.pathname, 'pathname');
                  setLocalStorage('path', location.pathname);
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
