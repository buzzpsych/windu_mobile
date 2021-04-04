import React, { useEffect, useState, cloneElement } from "react";
import { useQuery } from "@apollo/client";
import { instanceOf } from "prop-types";
import { useRecoilState, useSetRecoilState } from "recoil";
import { GET_USER } from "../graphql/queries/getUser";
import { userSession } from "../recoil/atoms/User/UserSession";
import { withNavigation } from "@react-navigation/native";

const AppProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useRecoilState(userSession);

  useQuery(GET_USER, {
    fetchPolicy: "cache-and-network",
    onCompleted: ({ getUser }) => {
      setProjects(getUser?.projects);
      setUser(getUser);
    },
  });

  useEffect(() => {
    // get token set
  }, [children]);

  if (!user) return navigation.navigate("Home");

  if (token) {
    return cloneElement(children, { user });
  }

  return navigation.navigate("Home");
};

AppProvider.propTypes = {
  children: instanceOf(Object),
};

export default AppProvider;
