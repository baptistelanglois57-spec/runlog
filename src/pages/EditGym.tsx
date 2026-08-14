import GymForm from "../components/GymForm";
import AppContainer from "../components/Layout/AppContainer";
import Section from "../components/Layout/Section";

export default function EditGym() {
  return (
    <AppContainer>
      <Section marginTop={0}>
        <GymForm />
      </Section>
    </AppContainer>
  );
}
