import React, { useContext } from "react";
import { Carousel, Spin } from "antd";

import HookContext, { actions } from "@stores/hookReducers";

const Banner = props => {
  const [, dispatch] = useContext(HookContext);
  console.log(
    "dispatch hook set userinfo {name:test123}",
    dispatch({ type: actions.SET_USER, payload: { name: "test123" } })
  );
  const banners = props.list || [];
  return (
    <Carousel effect="fade" autoplay className="banner-wrapper">
      {banners.length ? (
        banners.map(banner => (
          <div key={banner.img_max_url}>
            <img
              src={banner.img_max_url}
              alt={banner.title}
              className="banner-image"
            />
          </div>
        ))
      ) : (
        <Spin />
      )}
    </Carousel>
  );
};

export default Banner;
