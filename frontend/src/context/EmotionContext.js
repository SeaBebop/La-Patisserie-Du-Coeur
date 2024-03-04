import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import React, { PropsWithChildren, ReactElement } from 'react'
import { createContext,useState } from "react";

const EmotionContext = createContext({});

export const EmotionCacheProvider = ({ children, nonce }) => {
  const emotionCache = createCache({
    key: 'emotion-css-cache',
    prepend: true, // ensures styles are prepended to the <head>, instead of appended
  });

    return (
        <EmotionContext.Provider value={{ emotionCache }}>
        {children}
      </EmotionContext.Provider>
    );
    }

export default EmotionContext;