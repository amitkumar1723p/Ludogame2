import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import Modal from 'react-native-modal'; // ✅ Using react-native-modal
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

import { playSound } from '../helpers/SoundUtility';
import { resetAndNavigate } from '../helpers/NavigationUtil';
import { announceWinner, resetGame } from '../redux/reducers/gameSlice';
import { colorPlayer } from '../helpers/PlotData';

import Trophy from '../assets/animation/trophy.json';
import HeartGirl from '../assets/animation/girl.json';
import Firework from '../assets/animation/firework.json';

import Pile from './Pile';
import GradientButton from './GradientButton';

const WinModal = ({ winner }) => {
    const dispatch = useDispatch();
    const [visible, setVisible] = useState(!!winner);

    useEffect(() => {
        setVisible(!!winner);
    }, [winner]);

    const handleNewGame = () => {
        dispatch(resetGame());
        dispatch(announceWinner(null));
        playSound('game_start');
    };

    const handleHome = () => {
        dispatch(resetGame());
        dispatch(announceWinner(null));
        resetAndNavigate('HomeScreen');
    };

    return (
        <Modal
            isVisible={visible}
            backdropColor={'black'}
            backdropOpacity={0.8}
            animationIn="zoomIn"
            animationOut="zoomOut"
            onBackdropPress={handleHome}
            onBackButtonPress={handleHome}
            style={styles.modal}
        >
            <LinearGradient
                colors={['#0f0c29', '#302b63', '#24243e']}
                style={styles.gradientContainer}
            >
                <View style={styles.content}>
                    <View style={styles.pileContainer}>
                        <Pile player={winner} color={colorPlayer[winner - 1]} />
                    </View>

                    <Text style={styles.congratsText}>
                        Congratulations! PLAYER {winner}
                    </Text>

                    <LottieView
                        autoPlay
                        loop={false}
                        source={Trophy}
                        style={styles.trophyAnimation}
                    />

                    <LottieView
                        autoPlay
                        loop={true}
                        source={Firework}
                        style={styles.fireworkAnimation}
                    />

                    <GradientButton title={'NEW GAME'} onPress={handleNewGame} />
                    <GradientButton title={'HOME'} onPress={handleHome} />
                </View>
            </LinearGradient>

            <LottieView
                autoPlay
                loop
                source={HeartGirl}
                style={styles.girlAnimation}
            />
        </Modal>
    );
};

export default WinModal;

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0, // important to make full-screen modal
        // marginTop: 4
         

    },
    gradientContainer: {
        borderRadius: 20,
        width: '90%',
        borderWidth: 2,

        borderColor: 'gold',
        justifyContent: 'center',
        alignItems: 'center',
         marginBottom:200






    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    pileContainer: {
        marginTop: 20,
        width: 90,
        height: 20,
        justifyContent: "center",
        alignItems: 'center'
    },
    congratsText: {
        fontSize: 18,
        color: 'white',
        fontFamily: 'Philosopher-Bold',
        marginTop: 10,
    },
    trophyAnimation: {
        height: 200,
        width: 200,
        marginTop: 20,
    },
    fireworkAnimation: {
        height: 200,
        width: 500,
        position: 'absolute',
        // zIndex: -1,
        marginTop: 20,
    },
    girlAnimation: { 
        
        borderWidth:2,
        borderColor:'red',
        height: 500,
        width: 380,
        position: 'absolute',
        bottom: -200,
        right: -120,
        zIndex: 99,
    },
});
