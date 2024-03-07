export function Streamer({onBackgroundImageChange}) {
  const search = e => {
    e.preventDefault();

    let streamer = e.target.streamer.value;

    const headers = {
      "Client-ID": "kimne78kx3ncx6brgo4mv6wki5h1ko",
    };

    const query = `query { user(login: "${streamer}") { stream() { previewImageURL(width: 1920, height: 1080) } } }`;

    const requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({query}),
    };

    fetch("https://gql.twitch.tv/gql", requestOptions)
      .then(response => response.json())
      .then(data => {
        try {
          onBackgroundImageChange(data.data.user.stream.previewImageURL);
        } catch (e) {
          console.log(e);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <>
      <form id="streamerForm" className="join" onSubmit={search}>
        <input
          id="streamer"
          type="text"
          placeholder="Streamer"
          className="input input-bordered w-full max-w-xs join-item"
        />
        <button className="btn btn-primary join-item">
          <span className="material-symbols-outlined">search</span>
        </button>
      </form>
    </>
  );
}
