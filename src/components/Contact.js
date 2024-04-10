export default function Contact()
{
    return(
      <div class="container py-4 px-5 ">
        <form id="contactForm" style={{ background: "linear-gradient(to right, #ee5a6f, #f29263)",borderRadius:"20px"}}>
          <div className="p-5">
          <div class="mb-3">
            <label class="form-label" for="name">Name</label>
            <input class="form-control" id="name" type="text" placeholder="Name" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="emailAddress">Email Address</label>
            <input class="form-control" id="emailAddress" type="email" placeholder="Email Address" />
          </div>
          <div class="mb-3">
            <label class="form-label" for="message">Message</label>
            <textarea class="form-control" id="message"  style={{ height: "150px" }}  type="text" placeholder="Message"></textarea>
          </div>
          <div class="d-grid">
            <button class="btn btn-primary btn-lg" type="submit">Submit</button>
          </div>
          </div>
        </form>
      </div>
    )
}