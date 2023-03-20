import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const ThemeContext = React.createContext({
  theme: {},
  setTheme: () => {},
  setMainAppTheme: () => {},
  MainAppTheme: {},
});

export const ThemeContextProvider = ({ children, appTheme }) => {
  const themeData = getTheme(appTheme);
  const [theme, setTheme] = useState(themeData);
  const [mainAppTheme, setMainAppTheme] = useState(themeData);
  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        setMainAppTheme,
        MainAppTheme: mainAppTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const getTheme = (appTheme) => {
  const theme = {
    primary: {
      bgColor: appTheme.thm_primary_color || '#fff',
      fontStyle: appTheme.thm_main_font || '',
    },
    header: {
      bgColor: appTheme.thm_header_color || '#fff',
      fontStyle: appTheme.thm_header_font || '',
      textColor: appTheme.thm_header_text_color || '',
      textHighlightColor: appTheme.thm_header_text_highlight_color || '',
      buttonColor: appTheme.thm_header_button_color || '',
      buttonTextColor: appTheme.thm_header_button_text_color || '',
      buttonTextHighlightColor:
        appTheme.thm_header_button_text_highlight_color || '',
    },
    headerButtons: {
      bgColor: appTheme.thm_filter_row_background_color || '',
      textColor: appTheme.thm_header_menu_text_color || '',
      textHighlightColor: appTheme.thm_header_menu_text_highlight_color || '',
      // unselected
      buttonColor: appTheme.thm_light_button_color || '',
      buttonTextColor: appTheme.thm_light_button_text_color || '',
      buttonBorderColor: appTheme.thm_light_button_color || '',
      // selected
      buttonHighlightColor: appTheme.thm_medium_button_color || '',
      buttonTextHighlightColor: appTheme.thm_medium_button_text_color || '',
    },
    headerMenu: {
      bgColor: appTheme.thm_channel_menu_color || '',
      textColor: appTheme.thm_channel_menu_text_color || '',
      textHighlightColor: appTheme.thm_channel_menu_text_highlight_color || '',
      // unselected
      buttonColor: appTheme.thm_channel_light_button_color || '',
      buttonTextColor: appTheme.thm_channel_light_button_text_color || '',
      buttonBorderColor: appTheme.thm_channel_light_button_color || '',
      // selected
      buttonHighlightColor: appTheme.thm_channel_medium_button_color || '',
      buttonTextHighlightColor:
        appTheme.thm_channel_medium_button_text_color || '',
    },
    page: {
      bgColor: appTheme.thm_page_color || '',
      textColor: appTheme.thm_page_text_color || '',
      textHighlightColor: appTheme.thm_page_text_highlight_color || '',
      chatBgColor: appTheme.chatbg_color || '',
    },
    footer: {
      bgColor: appTheme.thm_footer_color || '',
      textColor: appTheme.thm_footer_text_color || '',
      textHighlightColor: appTheme.thm_footer_text_highlight_color || '',
    },
  };

  return theme;
};

ThemeContextProvider.propTypes = {
  children: PropTypes.node,
  appTheme: PropTypes.object,
};
