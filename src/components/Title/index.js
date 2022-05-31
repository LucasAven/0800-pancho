const Title = ({
  title,
  isAbsolute = false,
  color = null,
  backgroudColor = null,
}) => {
  return (
    <>
      {!isAbsolute && (
        <h1
          className={
            isAbsolute
              ? "section-title section-title--absolute"
              : "section-title"
          }
          style={{
            color: color != null ? color : "",
            backgroundColor: backgroudColor != null ? backgroudColor : "",
          }}
        >
          {title}
        </h1>
      )}
      {isAbsolute && (
        <h2
          className={
            isAbsolute
              ? "section-title section-title--absolute"
              : "section-title"
          }
          style={{
            color: color != null ? color : "",
            backgroundColor: backgroudColor != null ? backgroudColor : "",
          }}
        >
          {title}
        </h2>
      )}
    </>
  );
};

export default Title;
