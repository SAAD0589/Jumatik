import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import Register from "layouts/register";
import Infos from "layouts/infos";
import Categories from "layouts/categories";
import Ads from "layouts/ads";
import Search from "layouts/search";
import Ad from "layouts/ad";
import authReducer from "./state";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import RTLLayout from "layouts/rtl";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import axios from 'axios';
import ScrollToTop from "./helpers/ScrollToTop";
import { IntlProvider } from 'react-intl';
import { GoogleOAuthProvider, GoogleLogin  } from '@react-oauth/google';
import { tx } from '@transifex/native';
import { T } from '@transifex/react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en.json'
import { t, getLocale } from './helpers/TransWrapper';




tx.init({
  token: '1/0e4083104263e17b6c2cdbb6476dc765cf4b8264',
});

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, authReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
window.t = t;
ReactDOM.render(
  <GoogleOAuthProvider clientId="157748997984-fbpdo0bkfvv8t0cs9so42s1ghp35k6qs.apps.googleusercontent.com">
    <ChakraProvider theme={theme}>
      <React.StrictMode key={getLocale()}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistStore(store)}>
            <IntlProvider  locale={getLocale()} i18n={i18n}>
              <ThemeEditorProvider>
                <HashRouter basename="/" forceRefresh={true}>
                  <ScrollToTop />
                  <Switch>
                    <Route path={`/auth`} render={(props) => <AuthLayout {...props} t={t} />} />
                    <Route path={`/register`} render={(props) => <Register {...props} t={t} />} />
                    <Route path={`/admin`} render={(props) => <AdminLayout {...props} t={t} />} />
                    <Route path={`/ad`} component={Ad} />
                    <Route path={`/ads`} component={Ads} />
                    <Route path={`/search`} component={Search} />
                    <Route path={`/infos`} component={Infos} />
                    <Route path={`/categories`} component={Categories} />
                    <Route path={`/rtl`} component={RTLLayout} />
                    <Route exact path="/" render={() => <Redirect to="/admin" />} />
                  </Switch>
                </HashRouter>
              </ThemeEditorProvider>
            </IntlProvider>
          </PersistGate>
        </Provider>
      </React.StrictMode>
    </ChakraProvider>
  </GoogleOAuthProvider>,
  document.getElementById("root"),

);
