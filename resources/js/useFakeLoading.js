import { useEffect, useState } from "react";

export const useFakeLoading = (loading) => {
  const [fakeLoading, setFakeLoading] = useState(true);
  const TIME = 1000;

  useEffect(() => {
    setFakeLoading(true);
    let loadingTimeout = setTimeout(() => {
      setFakeLoading(false);
    }, TIME);

    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [loading]);

  return fakeLoading;
};