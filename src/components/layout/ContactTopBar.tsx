/** `.top-bar` contact-info bar used on adhesion/candidature/contact (not on the home page). */
export function ContactTopBar() {
  return (
    <div className="top-bar">
      <div className="container">
        <div className="top-bar-container">
          <div className="top-bar-info">
            <div className="top-bar-item">
              <i className="fas fa-phone-alt" />
              <span>Tél & WhatsApp : +221 77 538 66 27</span>
            </div>
            <div className="top-bar-item">
              <i className="fas fa-envelope" />
              <span>contact@conesess.sn</span>
            </div>
            <div className="top-bar-item">
              <i className="fas fa-map-marker-alt" />
              <span>Dakar, Sénégal</span>
            </div>
          </div>
          <div className="top-bar-info">
            <i className="fas fa-globe-africa" />
            <span>FORA'ESS Yaoundé 2024 ➔ Dakar 2026</span>
          </div>
        </div>
      </div>
    </div>
  )
}
