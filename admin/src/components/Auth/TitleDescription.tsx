interface TitleDescriptionProps {
  title: string;
  description: string;
}

const TitleDescription = ({ title, description }: TitleDescriptionProps) => {
  return (
    <div className="">
      <h1 className="text-7xl font-medium mb-8 text-center">
        <span className="text-[#002C69]">Biz</span>
        <span className="text-[#2563EB]">World</span>
      </h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#002C69] mb-2">{title}</h2>
        <p className="text-[#002C69] text-">{description}</p>
      </div>
    </div>
  );
};

export default TitleDescription;
