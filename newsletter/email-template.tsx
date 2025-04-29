import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Column,
  Row,
  Hr,
} from "@react-email/components"

interface EventEmailProps {
  events: EventModel[]
}

// Group events by date
const groupEventsByDate = (events: EventModel[]) => {
  return events.reduce(
    (acc, event) => {
      const dateKey = new Date(event.date_from).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      if (!acc[dateKey]) acc[dateKey] = []
      acc[dateKey].push(event)
      return acc
    },
    {} as Record<string, EventModel[]>,
  )
}

// Helper function to clean HTML from description
const cleanDescription = (htmlString: string) => {
  // Simple regex to remove HTML tags
  return htmlString.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 120) + "..."
}

// Helper function to truncate text
const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + "..."
}

export const EmailTemplate = ({ events }: EventEmailProps) => {
  const groupedEvents = groupEventsByDate(events)
  const currentYear = new Date().getFullYear()

  return (
    <Html>
      <Head>
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Plus+Jakarta+Sans:wght@400;600&display=swap');
          `}
        </style>
      </Head>
      <Preview>Linktank Weekly Events Roundup</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          <Section style={headerSection}>
            <Row>
              <Column>
                <Img
                  src="/linktank_logo.png"
                  width="30"
                  height="30"
                  alt="Linktank"
                  style={logoImage}
                />
                <Text style={logoText}>Linktank</Text>
              </Column>
            </Row>
          </Section>

          {/* Title */}
          <Heading style={title}>Weekly Events Roundup</Heading>
          <Text style={subtitle}>These are some of the best public policy and think tank events coming up</Text>

          {/* Events by Date */}
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <Section key={date} style={dateSection}>
              <Text style={dateHeader}>{date}</Text>

              {dateEvents.map((event) => (
                <Link
                  key={event._id}
                  href={"/events/" + event.backlink}
                  style={cardLink}
                  target="_blank"
                >
                  <div style={eventCard}>
                    <Row style={{ height: "150px" }}>
                      {/* Details Column */}
                      <Column style={eventDetailsColumn}>
                        {/* Time + Location Row */}
                        <Row>
                          <Column>
                            <Text style={timeAndLocationText}>
                              {!event.is_date_range && (
                                <span>
                                  {new Date(event.date_from).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                  })}{" "}
                                </span>
                              )}
                              <Img
                                src="/map-pin.svg"
                                width="16"
                                height="16"
                                alt="Location"
                                style={{
                                  display: "inline-block",
                                  verticalAlign: "middle",
                                  flexShrink: 0,
                                  margin: "0 4px",
                                }}
                              />
                              {truncateText(event.location, 30)}
                            </Text>
                          </Column>
                        </Row>

                        {/* Title Row */}
                        <Row>
                          <Column>
                            <Text style={eventTitle}>{truncateText(event.title, 60)}</Text>
                          </Column>
                        </Row>

                        {/* Organization Row */}
                        <Row>
                          <Column>
                            <Text style={organizationName}>
                            <span style={{ color: "#333333", fontWeight: 500 }}>By</span> {event.organization?.name || "Unknown Host"}
                            </Text>
                          </Column>
                        </Row>

                        {/* Description Row */}
                        <Row>
                          <Column>
                            <Text style={eventDescription}>
                              {event.brief_description
                                ? truncateText(event.brief_description, 120)
                                : cleanDescription(event.description)}
                            </Text>
                          </Column>
                        </Row>
                      </Column>

                      {/* Image Column */}
                      <Column style={eventImageColumn}>
                        <Img
                          src={event.organization?.logo_url || "https://via.placeholder.com/120"}
                          style={eventImage}
                          alt={`${event.organization?.name || "Event"} logo`}
                        />
                      </Column>
                    </Row>
                  </div>
                </Link>
              ))}
            </Section>
          ))}
          <Text style={footerText}>© {currentYear} Linktank. All rights reserved</Text>
          <Text style={footerText}>Not interested? Reply "Unsubscribe" to this email.</Text>
        </Container>
      </Body>
    </Html>
  )
}

export default EmailTemplate

const main = {
  paddingLeft: "5px",
  paddingRight: "5px",
  backgroundColor: "#ffffff",
  fontFamily: "Plus Jakarta Sans, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
}

const container = {
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
}

const headerSection = {
  padding: "20px 0",
}

const logoImage = {
  borderRadius: "50%",
  display: "inline-block",
  verticalAlign: "middle",
}

const logoText = {
  display: "inline-block",
  fontSize: "24px",
  fontWeight: "bold",
  marginLeft: "10px",
  verticalAlign: "middle",
  color: "#333333",
}

const title = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#333333",
  marginBottom: "5px",
}

const subtitle = {
  fontSize: "16px",
  color: "#666666",
  marginTop: "0",
  marginBottom: "10px",
}

const dateSection = {
  margin: "0"
}

const dateHeader = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#0e3b69",
  marginBottom: "10px",
  marginTop: "0",
}

const cardLink = {
  textDecoration: "none",
  color: "inherit",
  display: "block",
}

const eventCard = {
  border: "1px solid #D3D0D0",
  borderRadius: "16px",
  marginBottom: "20px",
  backgroundColor: "#ffffff",
};

const eventDetailsColumn = {
  width: "70%",
  paddingLeft: "10px",
  paddingRight: "10px",
};

const eventImageColumn = {
  width: "30%",
  verticalAlign: "middle",
  align: "center",
};

const timeAndLocationText = {
  fontSize: "14px",
  color: "#707070",
  lineHeight: "1.5",
  margin: "0",
};

const eventTitle = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#333333",
  margin: "0",
};

const organizationName = {
  fontSize: "14px",
  color: "#1F76F9",
  margin: "0",
};

const eventDescription = {
  fontSize: "14px",
  color: "#666666",
  lineHeight: "1.5",
  margin: "0"
};

const eventImage = {
  display: "block",
  margin: "auto",
  borderRadius: "8px",
  width: "100px",
  height: "100px",
}

const footerText = {
  fontSize: "12px",
  color: "#999999",
  marginTop: "0",
  marginBottom: "0",
}