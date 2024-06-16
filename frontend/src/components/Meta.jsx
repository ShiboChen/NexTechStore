import { Helmet } from "react-helmet-async";

const Meta = ({
  title = "Welcome To NexTechStore",
  description = "We offer top-quality products at unbeatable prices",
  keywords = "electronics, buy electronics, cheap electroincs",
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

export default Meta;
