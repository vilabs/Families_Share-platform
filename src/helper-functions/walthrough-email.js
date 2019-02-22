
function newWalkthroughEmail(given_name) {
  return (`<div
  style="height:100%;display:table;margin-left:auto;margin-right:auto"
>
  <div style="width:300px">
    <img
      style="display:block;margin-left:auto;margin-right:auto"
      src="https://www.families-share.eu/uploads/images/families_share_logo.png"
    />
      <p style="margin:1rem 0;font-size:1.3rem;color:#565a5c;">
        ${given_name},
          you requested a start up guide. Attached to this email, you will find a pdf containing a walkthrough of the platform, covering all main functionalities.
      </p>
    </div>
  </div>
</div>`
  );
}
module.exports = {
  newWalkthroughEmail : newWalkthroughEmail
};
