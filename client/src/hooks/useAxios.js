import axios from "axios";
import { useEffect, useState } from "react";

const useAxios = (url, method, body = null, headers = null) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios[method](url, JSON.parse(headers), JSON.parse(body))
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { loading, data, error };
};
export default useAxios;
