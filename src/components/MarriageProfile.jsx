import React, { useState, useRef, useEffect } from 'react';
import './MarriageProfile.css';
import profileData from '../data/profileData.json';

const MarriageProfile = () => {
  const images = profileData.profileImages || [profileData.profileImage];
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <div className="profile-container">
      {/* Decorative Corner Elements */}
      <div className="corner-decoration top-left"></div>
      <div className="corner-decoration top-right"></div>
      <div className="corner-decoration bottom-left"></div>
      <div className="corner-decoration bottom-right"></div>

      {/* Ganesha Header */}
      <div className="ganesha-header">
        <div className="om-symbol">ॐ</div>
        <div className="ganesha-text">|| श्री गणेशाय नमः ||</div>
      </div>

      {/* Main Content */}
      <div className="profile-content">
        {/* Photo Section */}
        <div className="photo-section">
          <div className="photo-frame">
            <div
              className="photo-slider"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="photo-slider-track"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${profileData.name} ${index + 1}`}
                    className="profile-photo"
                  />
                ))}
              </div>
            </div>
            {images.length > 1 && (
              <>
                <button className="slider-arrow slider-arrow-left" onClick={goPrev} aria-label="Previous photo">&#8249;</button>
                <button className="slider-arrow slider-arrow-right" onClick={goNext} aria-label="Next photo">&#8250;</button>
                <div className="slider-dots">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to photo ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="details-section">
          {/* Basic Details */}
          <div className="detail-group basic-details">
            <div className="detail-row">
              <span className="detail-label">Name</span>
              <span className="detail-separator">-</span>
              <span className="detail-value name-value">{profileData.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">DOB</span>
              <span className="detail-separator">-</span>
              <span className="detail-value">{profileData.dob}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Caste</span>
              <span className="detail-separator">-</span>
              <span className="detail-value">{profileData.caste}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Height</span>
              <span className="detail-separator">-</span>
              <span className="detail-value">{profileData.height}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Complexion</span>
              <span className="detail-separator">-</span>
              <span className="detail-value">{profileData.complexion}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Mother Tongue</span>
              <span className="detail-separator">-</span>
              <span className="detail-value">{profileData.motherTongue}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Religion</span>
              <span className="detail-separator">-</span>
              <span className="detail-value">{profileData.religion}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Address</span>
              <span className="detail-separator">-</span>
              <span className="detail-value">{profileData.address}</span>
            </div>
          </div>

          {/* Education */}
          <div className="detail-group">
            <h3 className="section-title">Education:</h3>
            {profileData.education.map((edu, index) => (
              <p key={index} className="section-content">{edu}</p>
            ))}
          </div>

          {/* Professional Details */}
          <div className="detail-group">
            <h3 className="section-title">Professional Details:</h3>
            <p className="section-content">{profileData.profession}</p>
          </div>

          {/* Hobbies */}
          <div className="detail-group">
            <h3 className="section-title">Hobby:</h3>
            {profileData.hobbies.map((hobby, index) => (
              <p key={index} className="section-content">{hobby}</p>
            ))}
          </div>

          {/* Family Details */}
          <div className="detail-group family-details">
            <h3 className="section-title">Family Details:</h3>
            <ol className="family-list">
              {profileData.familyDetails.map((member, index) => (
                <li key={index} className="family-member">
                  <span className="member-relation">{member.relation}'s Name:</span> {member.name}
                  <br />
                  <span className="member-occupation">Occupation - {member.occupation}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="profile-footer">
      </div>
    </div>
  );
};

export default MarriageProfile;
