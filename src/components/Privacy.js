import { Container, CssBaseline, Typography } from "@mui/material";

const Privacy = () => {
    return (
        <>
            <CssBaseline />
            <Container maxWidth="md" component="main" sx={{ px: 6, pt: 8, pb: 6 }} spacing={2}>
                <Typography variant="h3">Privacy</Typography>
                <br />
                <Typography variant="body2">
                    Your privacy is important to us. It is AllChat.online's policy to respect your privacy regarding any
                    information we may collect from you across our website, https://AllChat.online, and other sites we
                    own and operate.
                </Typography>
                <br />

                <Typography variant="body2">
                    We only ask for personal information when we truly need it to provide a service to you. We collect
                    it by fair and lawful means, with your knowledge and consent. We also let you know why we’re
                    collecting it and how it will be used.
                </Typography>
                <br />

                <Typography variant="body2">
                    Your email address and profile picture are the only personal information we collect from you. Any sensitive information
                    like passwords or user files are encrypted and excluded from storage. All chat histories are saved
                    only in your browser's local storage, and the "Memory" feature may store some information you
                    provide to the assistant, so please use it with care. Cleared logs are stored only for debugging
                    purposes and kept for 30 days.
                </Typography>
                <br />

                <Typography variant="body2">
                    We want to emphasize the importance of safeguarding sensitive and private information. While we
                    strive to create a secure online environment, we advise users not to provide any sensitive or
                    private information through prompts or interactive features on our website. We will never ask for
                    sensitive data such as passwords, financial information, or other confidential details through these
                    means. Please be cautious and refrain from sharing such information in any prompts or interactive
                    elements to ensure the protection of your privacy. If you encounter any requests for sensitive
                    information that appear to be from AllChat.online but seem suspicious, please contact us immediately
                    for verification.
                </Typography>
                <br />

                <Typography variant="body2">
                    We only retain collected information for as long as necessary to provide you with your requested
                    service. What data we store, we’ll protect within commercially acceptable means to prevent loss and
                    theft, as well as unauthorized access, disclosure, copying, use or modification.
                </Typography>
                <br />

                <Typography variant="body2">
                    We don’t share any personally identifying information publicly or with third-parties, except when
                    required to by law.
                </Typography>
                <br />

                <Typography variant="body2">
                    Our website may link to external sites that are not operated by us. Please be aware that we have no
                    control over the content and practices of these sites, and cannot accept responsibility or liability
                    for their respective privacy policies.
                </Typography>
                <br />

                <Typography variant="body2">
                    You are free to refuse our request for your personal information, with the understanding that we may
                    be unable to provide you with some of your desired services.
                </Typography>
                <br />

                <Typography variant="body2">
                    Your continued use of our website will be regarded as acceptance of our practices around privacy and
                    personal information. If you have any questions about how we handle user data and personal
                    information, feel free to contact us.
                </Typography>
                <br />

                <Typography variant="body2">This policy is effective as of 2 May 2024.</Typography>
                <br />

                <Typography variant="body2">AllChat.online is an entity of MaxSoft, Ltd</Typography>
                <br />
            </Container>
        </>
    );
};

export default Privacy;
