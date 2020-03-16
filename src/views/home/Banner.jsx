import React from "react";
import { Carousel, Spin } from "antd";

const Banner = props => {
 
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
