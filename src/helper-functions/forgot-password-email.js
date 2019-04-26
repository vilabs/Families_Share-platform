function newForgotPasswordEmail (token) {
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
        We got a request to change your password.
      </p>
      <a
        href="http://83.212.107.194:4000/api/users/changepasswordredirect/${token}"
        style="text-decoration:none"
      >
        <button
          style="color:#FFFFFF;background-color:#00838F;margin-left:20%;
        ;width:60%;height:3rem;font-size:1.3rem;line-height:3rem;
        text-align:center;border-radius:5px;border:none;"
        >
          Reset Password
        </button>
      </a>
      <p style="margin:1rem 0;font-size:1.3rem;color:#565a5c;">
        If you ignore this message, your password will not be changed
      </p>
    </div>
  </div>
</div>`
  )
}

module.exports = {
  newForgotPasswordEmail: newForgotPasswordEmail
}
