exports.handler = async function (event) {
  console.log("Entry: ", event);

  const res = {
    statusCode: 200,
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ message: "Hey World!" }),
  };

  console.log("RESPONSE ================================>", res);
  return res;
};
