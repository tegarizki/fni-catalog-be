
function Responses(
  statusCode: number,
  message: string,
  data = {},
): (object) {
  return {
    statusCode: statusCode,
    message: message,
    data: data,
  };
}
export default Responses;
