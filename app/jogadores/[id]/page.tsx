import FormJogador from '@/templates/Players/Form/page';

export default function Page({ params }: { params: { value: string } }) {
    return <FormJogador params={params} />;
}
