# Security Policy

## Supported Versions

We take security seriously and actively maintain the following versions:

| Version | Supported          | Status                 |
| ------- | ------------------ | ---------------------- |
| 0.1.x   | :white_check_mark: | Current stable release |
| < 0.1   | :x:                | No longer supported    |

## Security Context

Neural Particles is a client-side web application that uses:

- MediaPipe for hand tracking (runs in browser)
- WebRTC for camera access
- Three.js for 3D rendering
- No backend server or data storage
- No user authentication or personal data collection

## What We Collect

This application does NOT collect, store, or transmit:

- Personal information
- Camera footage or images
- Hand tracking data
- Usage analytics
- Cookies or local storage data

All processing happens locally in your browser. No data leaves your device.

## Potential Security Considerations

### Camera Access

- Application requires camera access for hand tracking
- Camera feed is processed locally by MediaPipe
- No video or images are uploaded or stored
- Camera access can be revoked at any time in browser settings

### Third-Party Dependencies

- MediaPipe (loaded from CDN: jsdelivr.net)
- Three.js and React ecosystem packages
- All dependencies are from trusted sources (npm, CDN)

### Browser Security

- Application requires HTTPS in production (enforced by WebRTC)
- localhost is allowed for development
- Modern browser security features apply (CSP, CORS, etc.)

## Reporting a Vulnerability

We appreciate responsible disclosure of security vulnerabilities.

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please report security issues privately:

1. **GitHub Security Advisories** (Preferred):
   - Go to: https://github.com/muhvarriel/neural-particles/security/advisories/new
   - Click "Report a vulnerability"
   - Fill out the form with details

2. **Email** (Alternative):
   - Check package.json for maintainer contact information
   - Email subject: "[SECURITY] Neural Particles Vulnerability Report"
   - Include detailed information (see below)

### What to Include

When reporting a vulnerability, please include:

- **Description**: Clear description of the vulnerability
- **Impact**: Potential impact and severity assessment
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Affected Versions**: Which versions are affected
- **Proof of Concept**: Code, screenshots, or video demonstrating the issue
- **Suggested Fix**: If you have ideas for remediation
- **Disclosure Timeline**: Your expected disclosure timeline

### What to Expect

After submitting a vulnerability report:

1. **Acknowledgment**: Within 48 hours
2. **Initial Assessment**: Within 5 business days
3. **Status Updates**: Every 7 days until resolved
4. **Fix Timeline**: Based on severity (see below)
5. **Credit**: Public acknowledgment (if desired) after fix is released

### Severity Levels and Response Times

| Severity | Description                        | Target Response Time |
| -------- | ---------------------------------- | -------------------- |
| Critical | Remote code execution, data breach | 24-48 hours          |
| High     | Authentication bypass, XSS, CSRF   | 5-7 days             |
| Medium   | Information disclosure, DoS        | 14-21 days           |
| Low      | Minor issues, edge cases           | 30-60 days           |

## Security Best Practices for Users

### For End Users

1. **Use HTTPS**: Always access the application via HTTPS in production
2. **Update Browser**: Keep your browser updated to the latest version
3. **Check Permissions**: Review camera permissions granted to the application
4. **Trusted Source**: Only use the official deployment or your own fork
5. **Private Environment**: Use in private settings if concerned about camera

### For Developers/Contributors

1. **Dependencies**:
   - Regularly update dependencies
   - Review security advisories for packages
   - Use `npm audit` to check for vulnerabilities

2. **Code Review**:
   - Review all external contributions
   - Watch for suspicious code patterns
   - Verify CDN integrity if adding external resources

3. **Testing**:
   - Test camera permission handling
   - Verify no data leakage
   - Check for XSS vulnerabilities in user inputs

4. **Deployment**:
   - Use HTTPS for all production deployments
   - Configure proper Content Security Policy (CSP)
   - Enable security headers (HSTS, X-Frame-Options, etc.)

## Known Security Considerations

### MediaPipe CDN Loading

The application loads MediaPipe from a CDN (jsdelivr.net):

- **Risk**: CDN compromise could inject malicious code
- **Mitigation**: Consider using Subresource Integrity (SRI) hashes
- **Future**: Investigate self-hosting MediaPipe models

### WebRTC Camera Access

Camera access is required for functionality:

- **Risk**: Malicious code could access camera feed
- **Mitigation**: All processing is client-side, no server transmission
- **User Control**: Users can deny or revoke camera permissions

### Client-Side Processing

All data processing happens in the browser:

- **Benefit**: No server-side attack surface
- **Benefit**: User data never leaves their device
- **Consideration**: Client-side code is visible and modifiable

## Security Updates

Security updates will be released as needed:

- **Critical/High**: Immediate patch release
- **Medium**: Included in next minor release
- **Low**: Included in next release cycle

Security advisories will be published on:

- GitHub Security Advisories
- Repository README (if critical)
- Release notes

## Dependency Security

### Automated Monitoring

We use:

- **Dependabot**: Automated dependency updates and security alerts
- **GitHub Security Advisories**: Automatic vulnerability scanning
- **npm audit**: Manual security audits before releases

### Update Policy

- Security patches: Applied immediately
- Minor updates: Weekly review and merge
- Major updates: Evaluated for breaking changes before upgrade

## Security-Related Configuration

### Recommended CSP Header

For production deployments, use this Content Security Policy:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://cdn.jsdelivr.net;
  media-src 'self' blob:;
  worker-src 'self' blob:;
```

Note: `unsafe-inline` and `unsafe-eval` required for Next.js and MediaPipe.

### Recommended Security Headers

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(self)
```

## Compliance and Privacy

### GDPR Compliance

This application:

- Does NOT collect personal data
- Does NOT use cookies
- Does NOT track users
- Requires explicit camera permission (user consent)
- Processes all data locally (no data transfers)

### Accessibility and Security

- Keyboard navigation does not bypass security controls
- Screen readers do not expose sensitive information
- No security through obscurity approaches used

## Contact

For general security questions (non-vulnerabilities):

- Open a GitHub Discussion
- Tag with "security" label

For vulnerability reports:

- Use GitHub Security Advisories (preferred)
- Or email maintainer (see package.json)

## Acknowledgments

We thank the security research community for helping keep this project secure.

Security researchers who responsibly disclose vulnerabilities will be acknowledged in:

- SECURITY.md (this file)
- Release notes for the fix
- GitHub security advisory

## Changes to This Policy

This security policy may be updated from time to time. Check the git history for changes:

- Last updated: 2025-12-04
- Version: 1.0

---

Thank you for helping keep Neural Particles and its users safe.
