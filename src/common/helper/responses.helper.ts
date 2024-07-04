
function Responses(
  status: string,
  message: string,
  data = {},
): (object) {
  return {
    status: status,
    message: message,
    data: data,
  };
}
export default Responses;