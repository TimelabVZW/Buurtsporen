import { useState } from "react";
import { ImageExpandContainer, Tiptap } from "../components";
import UserMenu from "../components/WYSIWYG/UserMenu";
import { Helmet } from "react-helmet";
import RasterLogoImage from '../assets/svg/BS_logo_raster_1.svg';


const Test = () => {
    return (
        <>
            <ImageExpandContainer src={RasterLogoImage} alt="/assets/BS_logo_raster_1.dfb016d2.svg" />
            <ImageExpandContainer src={RasterLogoImage} alt="/assets/BS_logo_raster_1.dfb016d2.svg" />
        </>
    )
};

export default Test;