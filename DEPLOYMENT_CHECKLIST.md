# Production Deployment Checklist

## Pre-Deployment (Development)

### Backend Services

- [ ] Supabase project created
- [ ] Database schema migrated
- [ ] Service role key secured in env
- [ ] Resend account created
- [ ] API key created and secured
- [ ] Email domain verified in Resend
- [ ] All dependencies installed correctly

### API Endpoints

- [ ] `POST /api/alerts` - Create alert endpoint working
- [ ] Validation logic correct (2 teams, valid email)
- [ ] Supabase save working
- [ ] Confirmation email sending
- [ ] `GET /api/alerts?email=...` - Retrieve endpoint working
- [ ] `POST /api/check-alerts` - Cron processor working
- [ ] All error handling in place

### Frontend

- [ ] `/notifications` page loads
- [ ] NotificationAlertsBuilder component displays
- [ ] Team search works
- [ ] 2-team limit enforced
- [ ] Email input validates
- [ ] Success/error messages display correctly
- [ ] API calls working

### Database

- [ ] `users` table exists with correct schema
- [ ] `notifications` table exists with correct schema
- [ ] Indexes created (email, match_id, user_id)
- [ ] Unique constraint on (user_id, match_id, type)
- [ ] Sample data inserted for testing

### Email

- [ ] Confirmation emails send to test email
- [ ] Email template renders correctly
- [ ] Sender address is verified
- [ ] No emails going to spam

## Staging Deployment

### Environment

- [ ] Environment variables set in staging
- [ ] Database migrated in staging
- [ ] Email service connected to staging endpoint
- [ ] Error logging configured

### Testing

- [ ] Full end-to-end test: signup → email → alert
- [ ] Test with multiple users
- [ ] Test duplicate prevention
- [ ] Test cron job with manual trigger
- [ ] Monitor error logs for issues
- [ ] Test rate limiting (if implemented)

### Monitoring

- [ ] Supabase monitoring dashboard active
- [ ] Resend dashboard checked for email status
- [ ] Error logs being captured
- [ ] Performance metrics tracked

## Production Deployment

### Pre-Launch

- [ ] Code reviewed and merged
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Performance optimized
- [ ] Backup strategy in place

### Environment Setup

- [ ] Production env variables set
- [ ] CRON_SECRET configured
- [ ] Email domain verified
- [ ] RLS policies configured in Supabase (if needed)
- [ ] Rate limiting configured

### Cron Job Setup

- [ ] Choose cron service:
  - [ ] Vercel Crons (if using Vercel)
  - [ ] GitHub Actions (if using GitHub)
  - [ ] EasyCron (external service)
  - [ ] Other: ****\_****
- [ ] Schedule configured (recommended: every 30 minutes)
- [ ] Authorization header set with CRON_SECRET
- [ ] Test cron job manually
- [ ] Monitor first few runs

### Monitoring & Alerts

- [ ] Supabase uptime monitoring active
- [ ] Resend delivery monitoring active
- [ ] Email bounce tracking enabled
- [ ] Error tracking configured (Sentry/LogRocket)
- [ ] Slack/email alerts for failures configured

### Documentation

- [ ] ALERTS_SETUP.md reviewed and up-to-date
- [ ] IMPLEMENTATION.md reviewed
- [ ] API documentation available
- [ ] Runbook created for common issues
- [ ] Team trained on system

## Post-Launch (First 24 Hours)

- [ ] Monitor email delivery rates
- [ ] Check error logs for issues
- [ ] Verify cron job running successfully
- [ ] Confirm users receiving alerts
- [ ] Monitor database performance
- [ ] Check email engagement (opens/clicks if tracked)
- [ ] Be ready to rollback if needed

## Ongoing Operations

### Weekly

- [ ] Check Resend dashboard for delivery issues
- [ ] Review error logs
- [ ] Monitor cron job execution
- [ ] Check database performance

### Monthly

- [ ] Review user metrics
- [ ] Analyze email engagement
- [ ] Clean up old notifications (archive or delete)
- [ ] Review and optimize database queries
- [ ] Update documentation if needed

### Quarterly

- [ ] Security audit
- [ ] Performance audit
- [ ] Backup integrity check
- [ ] Disaster recovery drill

## Rollback Plan

If issues occur:

### Quick Fixes

1. Check environment variables
2. Verify database connectivity
3. Check Resend API status
4. Review error logs
5. Test endpoints manually

### Rollback Steps

1. Disable cron job (comment out in `vercel.json` or disable in external service)
2. Set feature flag to hide `/notifications` route (if feature flag system exists)
3. Keep existing alerts in database (don't delete)
4. Investigate root cause
5. Deploy fix
6. Test thoroughly
7. Re-enable

## Performance Targets

### Frontend

- [ ] Page load time < 2 seconds
- [ ] API response < 500ms
- [ ] Search filtering instant (client-side)

### Backend

- [ ] Alert creation < 1 second
- [ ] Email sending < 2 seconds
- [ ] Cron job processing 1000 matches < 5 minutes

### Database

- [ ] User lookup < 100ms
- [ ] Notification insert < 50ms
- [ ] No N+1 queries

### Email

- [ ] Delivery rate > 99%
- [ ] Bounce rate < 0.5%
- [ ] Spam complaint rate < 0.1%

## Security Checklist

- [ ] CRON_SECRET is strong (32+ characters)
- [ ] Service role key is server-side only
- [ ] No secrets in git or logs
- [ ] Rate limiting on public endpoints
- [ ] Input validation on all endpoints
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] RLS policies configured (if needed)

## Budget & Costs

### Estimated Monthly Costs

- [ ] Supabase: $0-100 (depending on usage)
- [ ] Resend: $0-50 (pay per email, usually free tier OK)
- [ ] Hosting: $0-10 (if self-hosted) or included (Vercel)
- [ ] Domain: $10-15
- **Total**: $10-175/month

### Cost Optimization

- [ ] Archive old notifications quarterly
- [ ] Monitor Supabase storage
- [ ] Use Resend free tier if < 1000 emails/month
- [ ] Clean up unused data

## Sign-Off

- [ ] Project Manager: **\_** Date: **\_**
- [ ] Tech Lead: **\_** Date: **\_**
- [ ] QA Lead: **\_** Date: **\_**
- [ ] DevOps: **\_** Date: **\_**

---

## Support Contacts

- **Supabase Support**: support@supabase.io
- **Resend Support**: support@resend.com
- **Internal Slack**: #scoutai-alerts
- **On-Call Engineer**: [Add name/contact]
