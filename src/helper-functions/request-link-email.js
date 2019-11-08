function newEmail (link) {
  return (`<div
  style="height:100%;display:table;margin-left:auto;margin-right:auto"
>
  <div style="width:300px">
    <img
      style="display:block;margin-left:auto;margin-right:auto"
      src="https://www.families-share.eu/uploads/images/families_share_logo.png"
    />
      <p style="margin: 1rem 0;font-size:1.3rem;color:#565a5c;">Hi,</p>
      <p style="margin:1 rem 0;font-size: 1.3rem;color:#565a5c;">
        You requested the platforms web address.
      </p>
      <a
        href="${`${process.env.CITYLAB_URI}${link}`}"
        style="text-decoration:none"
      >
        <button
          style="color:#FFFFFF;background-color:#00838F;margin-left:20%;
        ;width:60%;height:3rem;font-size:1.3rem;line-height:3rem;
        text-align:center;border-radius:5px;border:none;"
        >
          Visit Platform
        </button>
      </a>
      <p style="margin:1rem 0;font-size:1.3rem;color:#565a5c;">
        This button will redirect you to the web version of the Families Share platform.
      </p>
    </div>
  </div>
</div>`
  )
}

module.exports = {
  newEmail
}
